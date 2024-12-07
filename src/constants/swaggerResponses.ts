import { ApiResponse } from '@nestjs/swagger';
import { Messages } from './messages';

export const ApiResponses = {
  Unauthorized: ApiResponse({
    status: 401,
    description: Messages.UNAUTHORIZED,
    example: {
      message: Messages.UNAUTHORIZED,
      error: 'Unauthorized',
      statusCode: 401,
    },
  }),
  InvalidToken: ApiResponse({
    status: 401,
    description: Messages.INVALID_TOKEN,
    example: {
      message: Messages.INVALID_TOKEN,
      error: 'Unauthorized',
      statusCode: 401,
    },
  }),
};
