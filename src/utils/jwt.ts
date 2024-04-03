import { env } from "~/env";
import { SignJWT, importJWK, jwtVerify } from "jose";

export const generateJWT = async (
  payload: any,
  expirationTime: number | string | Date,
) => {
  const secret = env.NEXTAUTH_SECRET || "secret";

  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(jwk);

  return jwt;
};

export const verifyJWT = async (token: string) => {
  const secret = env.NEXTAUTH_SECRET || "secret";
  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  try {
    const { payload } = await jwtVerify(token, jwk);
    return payload; // Return the payload if the token is valid and not expired
  } catch (err) {
    throw new Error("Invalid or expired token"); // Handle invalid or expired situations
  }
};
