import { IsIn, IsNumber, IsOptional, Matches } from 'class-validator';

const sortOrders = ['ASC', 'DESC'] as const;
type SortOrders = typeof sortOrders[number];
export class Pagination {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @Matches(/^$|^[0-9a-zA-Z]+$|^[0-9a-zA-Z]+[.]+[0-9a-zA-Z]+$/, {
    message:
      'sortBy: only alphanumeric characters and a dot character are allowed. A dot character must be followed by at least an alphanumeric character.',
  })
  @IsOptional()
  sortBy?: string;

  @IsIn(sortOrders)
  @IsOptional()
  sortOrder?: SortOrders;
}
