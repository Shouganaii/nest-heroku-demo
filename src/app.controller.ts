/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { AuthService } from "./modules/businessLayer/auth/auth.service";
import { Controller, UseGuards, Post, Get, Request } from "@nestjs/common";
import { LocalAuthGuard } from "./modules/businessLayer/auth/guards/local-auth.guard";
import { JwtAuthGuard } from "./modules/shared/guards/auth.guard";

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  getProfile() {
    return "hello world";
  }
}
