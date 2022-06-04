import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsMACAddress, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import 'reflect-metadata';
const type = ['IN', 'PARKING', 'OUT'] as const;

export class VehicleTypeDto {
  @IsString()
  @IsNotEmpty()
  vehicleColor: string;

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
  @IsIn(type)
  @IsNotEmpty()
  type: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => VehicleTypeDto)
  id!: VehicleTypeDto;
}

export class ParkingVehicleDto {
  @IsIn(type)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  licensePlates: string;

  @IsString()
  @IsNotEmpty()
  @IsMACAddress()
  macAddress: string;
}
