/**
 * ============================================================================
 *  SECURITY DEMONSTRATION TOGGLES  —  FOR COURSEWORK / DEMO USE ONLY
 * ============================================================================
 *
 * Each flag, when set to "true" in the environment, DISABLES a protection so
 * the corresponding vulnerability can be demonstrated live, then re-enabled.
 *
 * Defaults are SECURE (all false). NEVER enable these in production.
 *
 * Toggle them in backend/.env, e.g.:
 *     DEMO_ALLOW_PRIV_ESCALATION=true   # re-open mass-assignment / priv-esc
 *     DEMO_DISABLE_RATE_LIMIT=true      # re-open brute-force (no throttling)
 *
 * See SECURITY_DEMO_TOGGLES.md for the full exploit + remediation walkthrough.
 * ============================================================================
 */

// Demo #1 — Broken access control: privilege escalation via mass assignment.
// When true, public registration trusts a client-supplied `role`, so a user
// can register directly as "admin". Secure (false) restricts role to
// customer/shop.
// Accept true / True / TRUE / 1 (case-insensitive, whitespace-tolerant).
const isEnabled = (v: string | undefined) =>
    ["true", "1", "yes", "on"].includes(String(v ?? "").trim().toLowerCase());

export const DEMO_ALLOW_PRIV_ESCALATION = isEnabled(process.env.DEMO_ALLOW_PRIV_ESCALATION);

// Demo #2 — Broken authentication: no brute-force protection.
// When true, the auth rate limiter is bypassed, allowing unlimited login
// attempts (password guessing). Secure (false) throttles auth endpoints.
export const DEMO_DISABLE_RATE_LIMIT = isEnabled(process.env.DEMO_DISABLE_RATE_LIMIT);

// Emit a loud startup warning if any insecure demo toggle is active, so it is
// never left on by accident.
export function warnIfDemoTogglesEnabled() {
    const active: string[] = [];
    if (DEMO_ALLOW_PRIV_ESCALATION) active.push("DEMO_ALLOW_PRIV_ESCALATION");
    if (DEMO_DISABLE_RATE_LIMIT) active.push("DEMO_DISABLE_RATE_LIMIT");
    if (active.length > 0) {
        console.warn(
            "\n🚨 INSECURE SECURITY-DEMO TOGGLES ACTIVE: " +
            active.join(", ") +
            "\n   These intentionally disable protections. Do NOT use in production.\n"
        );
    }
}
