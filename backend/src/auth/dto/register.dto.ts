import { IsEmail, IsString, MinLength, IsOptional, IsIn } from "class-validator"

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsOptional()
  @IsIn(["user", "admin"])
  role?: string = "user"
}
