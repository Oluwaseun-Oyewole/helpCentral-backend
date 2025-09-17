import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '../common/abstract.interface';

export class IPaginate<T> {
  @ApiProperty()
  data: T;

  @ApiProperty({ description: 'Pagination meta details' })
  meta: PaginationMeta;
}

export class APISuccessResponse<TData = unknown> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  payload: TData;
}

export class APISSuccessResponsePaginated<TData = any> {
  @ApiProperty()
  success: boolean;
  payload: IPaginate<TData>;
}
