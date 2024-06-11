import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../types';

export class InvalidCaptchaException extends HttpException {
    constructor() {
        const data = {
            code: ErrorCode.VALIDATION_ERROR,
            data: [
                {
                    field: 'captcha',
                    errors: [ 'The captcha is invalid' ]
                }
            ]
        };

        super(data, HttpStatus.BAD_REQUEST);
    }
}