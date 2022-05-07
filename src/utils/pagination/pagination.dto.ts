import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

const sortOrders = ['ASC', 'DESC'] as const;
type SortOrders = typeof sortOrders[number];
export class Pagination {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsIn(sortOrders)
  @IsOptional()
  sortOrder?: SortOrders;
}
