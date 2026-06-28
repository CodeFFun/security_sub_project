import { Request, Response, NextFunction } from "express";

/**
 * Lightweight structured activity logger for auditing / incident response.
 *
 * Deliberately logs only non-sensitive metadata — method, path, status,
 * duration, client IP, and (if authenticated) the acting user's id + role.
 * It NEVER logs request bodies, headers (which carry the bearer token), query
 * strings, or response payloads, so credentials and PII are not written to
 * logs.
 *
 * Auth-relevant endpoints are tagged so login attempts / failures stand out
 * for security review.
 */

// Paths whose failures are security-relevant (auth / privilege).
const SECURITY_SENSITIVE = ["/auth/login", "/auth/register", "/auth/update-by-email", "/auth/admin"];

function isSecuritySensitive(path: string): boolean {
    return SECURITY_SENSITIVE.some((p) => path.startsWith(p));
}

export const activityLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
        const durationMs = Date.now() - start;
        const user = (req as any).user;
        const entry = {
            ts: new Date().toISOString(),
            method: req.method,
            path: req.path, // path only — never the query string
            status: res.statusCode,
            durationMs,
            ip: req.ip,
            userId: user?._id ? String(user._id) : undefined,
            role: user?.role,
            security: isSecuritySensitive(req.path) || undefined,
        };

        // Flag auth failures loudly for monitoring/alerting hooks to pick up.
        const isAuthFailure = isSecuritySensitive(req.path) && res.statusCode >= 400;
        const line = `[activity] ${JSON.stringify(entry)}`;
        if (isAuthFailure || res.statusCode >= 500) {
            console.warn(line);
        } else {
            console.log(line);
        }
    });

    next();
};
