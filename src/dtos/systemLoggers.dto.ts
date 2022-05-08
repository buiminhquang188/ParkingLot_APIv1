// import { Pagination } from '@/utils/pagination/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class SystemLoggersDto {
  @IsString()
  @IsOptional()
  public method: string;

  @IsString()
  @IsOptional()
  public status: string;

  @IsString()
  @IsOptional()
  public startTime: Date;

  @IsString()
  @IsOptional()
  public endTime: Date;
}
