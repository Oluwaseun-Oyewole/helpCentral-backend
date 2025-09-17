import { ApiProperty } from '@nestjs/swagger';

export class APIErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ description: 'error message is a string' })
  message: string;

  @ApiProperty({ type: Date })
  timestamp: Date | string;
}

export class APIValidationErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    description: 'error message is a string',
    example: 'Validation Error',
  })
  message: string | object;

  @ApiProperty({ description: 'error is an array of strings' })
  error: Array<string>;

  @ApiProperty({ type: Date })
  timestamp: Date | string;
}
