import { Controller, Post, Route, Body } from "tsoa";
import * as jwt from "jsonwebtoken";
import { UserService } from "../../data-layer/services/UserService";

@Route("auth")
export class AuthController extends Controller {
 

  @Post("/login")
  public async login(@Body() body: { email: string; password: string }): Promise<{ token: string }> {
    const userService = new UserService()
    const { email, password } = body;

    const user = await userService.findUserByLogin(email, password);
    if (!user) {
      this.setStatus(401);
      throw new Error("Invalid credentials");
    }

    let scopes: string[] = [];
    if (user.role === "admin") {
      scopes.push("admin");
    }
    if (user.role === "user") {
      scopes.push("user");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        scopes: scopes,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token };
  }
}