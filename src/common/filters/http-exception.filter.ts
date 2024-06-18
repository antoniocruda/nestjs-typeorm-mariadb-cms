import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ErrorCode } from '../types';
import { Response } from 'express';
import Joi from 'joi';
import { CommonUtil } from '../lib/common.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        let jsonData:Record<string, unknown> = {
            status,
            data: exception.message
        };

        if (typeof exception.getResponse() === 'object' && status === 400) {
            if (Object.prototype.hasOwnProperty.call(exception.getResponse(), 'code')) {
                jsonData = exception.getResponse() as Record<string, unknown>;
            }
            else if (exception.getResponse() instanceof Joi.ValidationError) {
                const err = exception.getResponse() as Joi.ValidationError;

                const errors = CommonUtil.processValidationErrors(err.details);
                jsonData = {
                    code: ErrorCode.VALIDATION_ERROR,
                    data: errors
                };
            }
            else {
                jsonData = {
                    code: ErrorCode.VALIDATION_ERROR,
                    data: [
                        {
                            'field': '__common_',
                            'errors': [(exception.getResponse() as Record<string, unknown>).message]
                        }
                    ]
                };
            }
        }
        else if (status === 400) {
            jsonData = {
                code: ErrorCode.VALIDATION_ERROR,
                data: [
                    {
                        field: '__common__',
                        errors: [ exception.message ]
                    }
                ]
            };
        }
        else if (status === 413) {
            jsonData = {
                code: ErrorCode.FILE_TOO_LARGE,
                data: exception.message
            };
        }
        else if (
            (status === 401)
            || (status === 403)
        ) {
            jsonData.code = ErrorCode.AUTHORIZATION_ERROR;
            jsonData.data = 'You don\'t have permission to access this function.';
        }
    
        response 
            .status(status)
            .json(jsonData);
    }
}