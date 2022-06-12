import { isCamelCase } from './../../util';
import { SelectQueryBuilder } from 'typeorm';
export const paginate = async function (
  builder: SelectQueryBuilder<any>,
  page: number,
  pageSize: number,
  sortBy: string,
  sortOrder: any,
): Promise<PaginationAwareObject> {
  const skip = (page - 1) * pageSize;
  const count = await builder.getCount();
  const calcule_last_page = count % pageSize;
  const last_page = calcule_last_page === 0 ? count / pageSize : Math.trunc(count / pageSize) + 1;
  let res = null;

  if(!sortBy) sortBy = 'createdAt';
  if (isCamelCase(sortBy)) sortBy = JSON.stringify(sortBy);

  if (sortBy) {
    res = await builder
      // .orderBy('createdAt', 'DESC')
      .orderBy(sortBy, sortOrder)
      .skip(skip)
      .take(pageSize)
      .getMany();
  } else {
    res = await builder.orderBy('"createdAt"', sortOrder).skip(skip).take(pageSize).getMany();
  }
  return {
    from: skip <= count ? skip + 1 : null,
    to: count > skip + pageSize ? skip + pageSize : count,
    pageSize: pageSize,
    total: count,
    current_page: page,
    prev_page: page > 1 ? page - 1 : null,
    next_page: count > skip + pageSize ? page + 1 : null,
    last_page: last_page,
    data: res || [],
  };
};

export interface PaginationAwareObject {
  from: any;
  to: any;
  pageSize: any;
  total: number | any;
  current_page: number;
  prev_page?: number | null;
  next_page?: number | null;
  last_page: number | null;
  data: Array<object | any> | any;
}
