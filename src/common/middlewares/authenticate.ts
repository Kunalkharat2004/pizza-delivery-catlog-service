import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Request } from "express";
import { AuthCookie } from "../types";
import config from "config";

export default expressjwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: config.get("auth.jwksUri"),
    cache: true,
    rateLimit: true,
  }) as unknown as GetVerificationKey,

  algorithms: ["RS256"],

  getToken: (req: Request) => {
    const { accessToken } = req.cookies as AuthCookie;

    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer" &&
      req.headers.authorization.split(" ")[1] !== undefined
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (accessToken) {
      return accessToken;
    }
  },
});
