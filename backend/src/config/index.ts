import dotenv from "dotenv";
dotenv.config();

const WEAK_JWT_SECRETS = ["your_jwt_secret_key", "secret", "changeme", ""];
const isProduction = process.env.NODE_ENV === "production";

export const PORT = process.env.PORT || 8080;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/skillsub_db";

// Frontend origin allowed by CORS (do not use "*" so credentials/headers stay scoped)
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// JWT secret must be strong. Fail closed in production if it is missing or a
// well-known weak placeholder; only warn in dev/test so local setup still works.
const rawJwtSecret = process.env.JWT_SECRET ?? "";
if (WEAK_JWT_SECRETS.includes(rawJwtSecret) || rawJwtSecret.length < 32) {
    const message =
        "JWT_SECRET is missing, too short, or a known weak value. " +
        "Set a strong random JWT_SECRET (>= 32 chars) in the environment.";
    if (isProduction) {
        throw new Error(message);
    } else {
        console.warn(`⚠️  ${message} (allowed in non-production only)`);
    }
}
export const JWT_SECRET = rawJwtSecret || "insecure-dev-only-secret-do-not-use-in-production";

// eSewa Payment Gateway Configuration
export const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || "EPAYTEST";
export const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
export const ESEWA_SUCCESS_URL = process.env.ESEWA_SUCCESS_URL || "http://localhost:8080/payment/esewa/success";
export const ESEWA_FAILURE_URL = process.env.ESEWA_FAILURE_URL || "http://localhost:8080/payment/esewa/failure";
export const ESEWA_PAYMENT_URL = process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
export const ESEWA_VERIFY_URL = process.env.ESEWA_VERIFY_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
