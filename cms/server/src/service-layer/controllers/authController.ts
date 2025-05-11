import { Controller, Post, Route, Body, Security, Tags, Request, Get } from "tsoa";
import * as jwt from "jsonwebtoken";
import { ChangePasswordRequest } from "../../data-layer/models/models";
import { UserService } from "../../data-layer/services/UserService";

@Route("auth")
@Tags("auth")
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
  @Post("changePassword")
  @Security("jwt")
  public async changePassword(
    @Body() body: ChangePasswordRequest,
    @Request() req: any
  ): Promise<{ message: string }> {
    const id = req.user.id;
    const userService = new UserService()
    try {
      const result = await userService.changePassword(
      id,
      body.oldPassword,
      body.newPassword
      )
      
      if (!result) {
        this.setStatus(400);
        return { message: "Old password incorrect" };
      }
      return { message: "Password changed successfully" };

      } catch (error) {
      console.log(error)
    }
    return { message: "Failure to change password"}
  }
  @Get("/me")
  @Security("jwt")
  public async me(@Request() req: any): Promise<{ first_name: string; last_name: string; email: string; colorPref: string; avatar: string; country: string}> {
    const userId = req.user.id;
    const userService = new UserService();
    const userInfo = await userService.getUserInfo(userId);
    if (!userInfo) {
      this.setStatus(404);
      throw new Error("User not found");
    }
    return userInfo;
  }
}