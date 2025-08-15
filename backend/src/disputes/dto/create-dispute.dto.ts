import { IsString, IsNumber } from "class-validator"

export class CreateDisputeDto {
  @IsNumber()
  credit_report_item_id: number

  @IsString()
  dispute_reason: string
}
