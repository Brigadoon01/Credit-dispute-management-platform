import { IsString, IsOptional, IsNumber } from "class-validator"

export class GenerateLetterDto {
  @IsOptional()
  @IsNumber()
  dispute_id?: number

  @IsString()
  dispute_reason: string

  @IsString()
  account_name: string

  @IsString()
  account_type: string
}
