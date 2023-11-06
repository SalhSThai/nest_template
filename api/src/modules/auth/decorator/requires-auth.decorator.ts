import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from "src/auth/enums/role.enum";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { UserRoleGuard } from "../guards/role.guard";

export const ROLE_KEY = "role";
export const RequiresAuth = (...role: Role[]) => applyDecorators(UseGuards(JwtAuthGuard, UserRoleGuard), SetMetadata(ROLE_KEY, role));
