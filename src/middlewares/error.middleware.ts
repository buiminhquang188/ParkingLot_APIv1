import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@utils/logger';
import { ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || error?.httpCode || httpStatus.INTERNAL_SERVER_ERROR;

    const tempMessage: any = [];
    if (error?.errors) {
      error?.errors.forEach(element => {
        tempMessage.push(getErrorMessage(element, []).join(', '));
      });
    }
    const message: string = tempMessage?.join(', ') || error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

const getErrorMessage = (validationError: ValidationError, result: any): any => {
  if (validationError.children?.length === 0) {
    result.push(Object.values(validationError.constraints).join(', '));
  }
  for (let i = 0; i < validationError.children?.length; ++i) {
    getErrorMessage(validationError.children[i], result);
  }
  return result;
};

export default errorMiddleware;
