import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FindOptionsWhere, FindOptionsOrder, ILike } from 'typeorm';

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  [key: string]: any;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const ApiQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): QueryParams => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    return {
      page: query._page ? parseInt(query._page, 10) : 1,
      limit: query._limit ? parseInt(query._limit, 10) : 10,
      sort: query._sort || 'createdAt',
      order: query._order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      ...query,
    };
  },
);

export function buildWhereConditions<T>(
  query: QueryParams,
  searchableFields: string[] = [],
): FindOptionsWhere<T> {
  const where: any = {};

  // Remove pagination and sorting params
  const excludedKeys = [
    '_page',
    '_limit',
    '_sort',
    '_order',
    'page',
    'limit',
    'sort',
    'order',
  ];

  Object.keys(query).forEach((key) => {
    if (!excludedKeys.includes(key) && query[key] !== undefined) {
      const value = query[key];

      // Handle search with _like suffix (case-insensitive)
      if (key.endsWith('_like')) {
        const field = key.replace('_like', '');
        if (searchableFields.includes(field)) {
          where[field] = ILike(`%${value}%`);
        }
      }
      // Handle greater than or equal
      else if (key.endsWith('_gte')) {
        const field = key.replace('_gte', '');
        where[field] = { $gte: value };
      }
      // Handle less than or equal
      else if (key.endsWith('_lte')) {
        const field = key.replace('_lte', '');
        where[field] = { $lte: value };
      }
      // Handle not equal
      else if (key.endsWith('_ne')) {
        const field = key.replace('_ne', '');
        where[field] = { $ne: value };
      }
      // Exact match
      else {
        where[key] = value;
      }
    }
  });

  return where;
}

export function buildOrderConditions<T>(
  query: QueryParams,
): FindOptionsOrder<T> {
  const order: any = {};

  if (query.sort) {
    order[query.sort] = query.order || 'DESC';
  }

  return order;
}

export function buildPaginationOptions(query: QueryParams) {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}
