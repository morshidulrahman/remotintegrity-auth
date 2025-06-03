import jwt from 'jsonwebtoken';


export const generateToken = (payload: any,  secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn });
};



export const createToken = (
  jwtPayload: {
    userId: string;
    email: string;
    role: string;
    },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};