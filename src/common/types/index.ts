import { Request } from "express";

export interface AuthCookie {
  accessToken: string;
}

export interface AuthRequest extends Request {
    auth: {
      sub: string;
      role: string;
      jti: string;
    };
  }