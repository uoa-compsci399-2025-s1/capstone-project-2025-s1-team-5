import * as jwt from "jsonwebtoken";

export function generateToken(user: {
  id: string;
  email: string;
  role: string;
}): string {
  const scopes: string[] = [];
  if (user.role === "admin") scopes.push("admin");
  if (user.role === "user") scopes.push("user");

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not set in environment");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      scopes,
    },
    secret,
    { expiresIn: "1h" },
  );
}
