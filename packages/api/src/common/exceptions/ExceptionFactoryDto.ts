import { BadRequestException } from '@nestjs/common';

/**
 * exceptionFactory used in a ValidationPipe to
 * display error by fields
 */
export default (errors) => {
  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error?.constraints || {})
      .join('. ')
      .trim();
  });
  return new BadRequestException({
    statusCode: 400,
    message: errorMessages,
    error: 'Bad Request',
  });
};
