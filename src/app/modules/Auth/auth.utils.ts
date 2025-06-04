import jwt from 'jsonwebtoken';
import { AuthUser } from './auth.interface';

/**
 * Utility function to generate JWT token
 * @param payload - The data to be included in the token (usually user info)
 * @param secret - The secret key to sign the token
 * @param expiresIn - Expiration time for the token (e.g., '1h', '30d')
 * @returns JWT token
 */
export const generateToken = (
  payload: AuthUser | any, // Payload can be the user or any other data
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const createToken = (
  jwtPayload: AuthUser | any,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};
