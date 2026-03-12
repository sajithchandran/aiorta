import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Request, Response } from "express";
import { AppError } from "../errors/app-error";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        success: false,
        error: exception.getResponse(),
        path: request.url
      });
      return;
    }

    if (exception instanceof AppError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
          metadata: exception.metadata ?? null
        },
        path: request.url
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred."
      },
      path: request.url
    });
  }
}
