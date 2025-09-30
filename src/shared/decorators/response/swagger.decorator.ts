import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { APIErrorResponse } from 'src/shared/dto/error-response.dto';
import { APISuccessResponse } from '../../dto/success-response.dto';

export const SuccessApiResponse = <TModel extends Type<any>>(
  model: TModel,
  options: {
    isArray?: boolean;
    description?: string;
    status?: number | HttpStatus;
  } = {
    isArray: false,
    status: 200,
  },
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(APISuccessResponse) },
          {
            properties: options?.isArray
              ? {
                  payload: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                }
              : {
                  payload: {
                    allOf: [{ $ref: getSchemaPath(model) }],
                  },
                },
          },
        ],
      },
      status: options.status || 200,
      description: options.description,
    }),
  );
};

export const ErrorApiResponse = (
  options: { status?: number | HttpStatus } = {
    status: 400,
  },
) => {
  return applyDecorators(
    ApiResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(APIErrorResponse) }],
      },
      status: options.status,
    }),
  );
};
