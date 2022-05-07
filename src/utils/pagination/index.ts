import { NextFunction } from 'express';
import { Response } from 'express';
import { Request } from 'express';
import { PaginationAwareObject, paginate } from './helper/pagination';
import { SelectQueryBuilder } from 'typeorm';
import { Pagination } from './pagination.dto';
declare module 'typeorm' {
  export interface SelectQueryBuilder<Entity> {
    paginate(pageSize?: number | null): Promise<PaginationAwareObject>;
  }
}

/**
 * Boot the package by patching the SelectQueryBuilder
 *
 */
export function pagination(req: Request, res: Response, next: NextFunction): void {
  SelectQueryBuilder.prototype.paginate = async function (pageSize?: number | null): Promise<PaginationAwareObject> {
    const requestQuery: Pagination = req.query;

    const paginationDto = {
      page: requestQuery.page,
      pageSize: requestQuery.pageSize,
      sortBy: requestQuery.sortBy,
      sortOrder: requestQuery.sortOrder?.toUpperCase(),
    };
    
    const current_page = paginationDto.page || 1;
    // If not set, then get from request, default to 15
    pageSize = paginationDto.pageSize || 15;
    return await paginate(this, current_page, pageSize, paginationDto.sortBy, paginationDto.sortOrder);
  };
  next();
}
