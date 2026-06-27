import { Request, Response, NextFunction } from "express";
import { DEMO_DISABLE_RATE_LIMIT } from "../config/security-demo";

/**
 * Sets common security-related HTTP response headers without pulling in an
 * external dependency (helmet). Mitigates clickjacking, MIME sniffing, and
 * referrer/permission leakage.
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
    // Clickjacking protection
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
    // Prevent MIME-type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Limit referrer leakage
    res.setHeader("Referrer-Policy", "no-referrer");
    // Disable legacy/dangerous browser features
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    // Modern browsers ignore X-XSS-Protection; explicitly disable the buggy filter
    res.setHeader("X-XSS-Protection", "0");
    // Force HTTPS when running behind TLS in production
    if (process.env.NODE_ENV === "production") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
};

/**
 * Minimal in-memory fixed-window rate limiter. Good enough to slow down
 * credential brute-forcing and abuse without an external store. For a
 * multi-instance deployment this should be backed by Redis instead.
 */
interface RateLimitOptions {
    windowMs: number;
    max: number;
    message?: string;
}

export const rateLimit = ({ windowMs, max, message }: RateLimitOptions) => {
    // DEMO TOGGLE: when DEMO_DISABLE_RATE_LIMIT is on, throttling is bypassed
    // entirely so brute-force / credential-stuffing can be demonstrated.
    if (DEMO_DISABLE_RATE_LIMIT) {
        return (_req: Request, _res: Response, next: NextFunction) => next();
    }

    const hits = new Map<string, { count: number; resetAt: number }>();

    // Periodically drop expired buckets so the map does not grow unbounded.
    const sweeper = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of hits) {
            if (entry.resetAt <= now) hits.delete(key);
        }
    }, windowMs);
    // Do not keep the process alive just for the sweeper (matters for tests).
    if (typeof sweeper.unref === "function") sweeper.unref();

    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.ip || req.socket.remoteAddress || "unknown";
        const now = Date.now();
        const entry = hits.get(key);

        if (!entry || entry.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        entry.count += 1;
        if (entry.count > max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            res.setHeader("Retry-After", String(retryAfter));
            return res.status(429).json({
                success: false,
                message: message || "Too many requests. Please try again later.",
            });
        }
        return next();
    };
};
