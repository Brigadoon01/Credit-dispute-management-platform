import { IsString, IsOptional, IsIn } from "class-validator"

export class UpdateDisputeStatusDto {
  @IsOptional()
  @IsIn(["pending", "submitted", "under_review", "resolved", "rejected"])
  status?: string

  @IsOptional()
  @IsString()
  admin_notes?: string

  @IsOptional()
  @IsString()
  resolution_notes?: string
}