import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../../../common/helper/role.types";

export class UserUpdate{
    @IsString()
    @MinLength(3)
    @IsOptional()
    name?: string

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole
}