import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import "reflect-metadata";
const type = ['IN', 'OUT'] as const;

export class VehicleTypeDto {
  @IsString()
  @IsNotEmpty()
  vehicleColor: string;

  @IsString()
  @IsNotEmpty()
  block: string;

  @IsString()
  @IsNotEmpty()
  slotId: string;

  @IsString()
  @IsNotEmpty()
  twoFirstDigits: string;

  @IsString()
  @IsNotEmpty()
  fourLastDigits: string;

  @IsString()
  @IsNotEmpty()
  licensePlates: string;
}

export class VehicleDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsIn(type)
  @IsNotEmpty()
  type: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleTypeDto)
  id!: VehicleTypeDto;
}
