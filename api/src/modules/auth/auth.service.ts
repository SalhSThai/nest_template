/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import ms = require("ms");
import { ExpiredTooLongException } from "./exceptions/expired-too-long.exception";
import { ErrorException, invalidLoginException, invalidUserTypeException } from "src/error/error.exception";
import { Role } from "./enums/role.enum";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService, private readonly httpService: HttpService) {}
  async validateUser(email: string, password: string, role: Role) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: email },
      });
      if (!user) throw new invalidLoginException("You have entered an invalid username or password");
      if (user.role !== role) throw new invalidUserTypeException("Login type invalid");

      const validated = await bcrypt.compare(password, user.password);
      if (!validated) throw new invalidLoginException("You have entered an invalid username or password");
      if (validated) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
  async setLineRichMenu(lineId: string) {
    this.httpService.post(`https://api.line.me/v2/bot/user/${lineId}/richmenu/richmenu-f0ccd48755a77ca892fbf035d29ec6d1`);
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      user_type: user.user_type,
    };
    return this.jwtService.sign(payload);
  }

  async refreshToken(token: string) {
    return this.jwtService.verifyAsync(token, { ignoreExpiration: true }).then((response) => {
      const exp = new Date(response.exp).getTime();
      const today = new Date().getTime();
      const time_passed = today - exp;
      const week = today + ms("1 week");
      const payload = {
        email: response.email,
        sub: response.sub,
        user_type: response.user_type,
      };
      if (time_passed < week) {
        return this.jwtService.sign(payload);
      } else {
        throw new ExpiredTooLongException();
      }
    });
  }
}
