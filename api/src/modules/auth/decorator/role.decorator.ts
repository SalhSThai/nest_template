/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/role.enum";

export const ROLE_KEY = "role";
export const RoleDecorator = (...role: Role[]) => SetMetadata(ROLE_KEY, role);
