import {
  BadRequestException,
  Injectable,
  ValidationPipe as NestValidationPipe,
  ValidationError,
} from "@nestjs/common";

@Injectable()
export class AppValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = flattenValidationErrors(errors);
        return new BadRequestException({
          statusCode: 400,
          message: formattedErrors,
          error: "Bad Request",
        });
      },
    });
  }
}

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = "",
  result: Record<string, string> = {}
) {
  for (const err of errors) {
    const propertyPath = parentPath
      ? `${parentPath}.${err.property}`
      : err.property;

    if (err.constraints) {
      // Для каждого constraint добавляем в результат — можно взять первую или объединить
      result[propertyPath] = Object.values(err.constraints)[0];
    }

    if (err.children && err.children.length > 0) {
      flattenValidationErrors(err.children, propertyPath, result);
    }
  }
  return result;
}
