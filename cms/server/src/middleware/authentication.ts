import * as express from "express";
import * as jwt from "jsonwebtoken";

type DecodedToken = {
  id: number;
  name?: string;
  scopes: string[];
  [key: string]: any;
};

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[] = [],
): Promise<DecodedToken> {
  if (securityName === "jwt") {
    const authHeader = request.headers["authorization"];
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    return new Promise((resolve, reject) => {
      if (!token) {
        return reject(new Error("No token provided"));
      }

      jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err, decoded: any) => {
          if (err) {
            return reject(err);
          }

          if (!decoded || !decoded.scopes || !Array.isArray(decoded.scopes)) {
            return reject(new Error("Invalid token scopes"));
          }

          for (let scope of scopes) {
            if (!decoded.scopes.includes(scope)) {
              return reject(new Error("JWT does not contain required scope."));
            }
          }

          resolve(decoded);
        },
      );
    });
  }

  return Promise.reject(new Error("Unsupported security scheme"));
}
