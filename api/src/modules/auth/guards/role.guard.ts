/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorator/public.decorator";
import { ROLE_KEY } from "../decorator/role.decorator";
import { Role } from "../enums/role.enum";

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [context.getHandler(), context.getClass()]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles || isPublic) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !requiredRoles.some((role) => user?.role == role)) {
      throw new ForbiddenException("This role does not have access");
    } else {
      return true;
    }
  }
}
