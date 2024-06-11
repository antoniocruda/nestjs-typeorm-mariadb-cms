import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../types';

export class AccountInactiveException extends HttpException {

    constructor() {
        const data = {
            code: ErrorCode.ACCOUNT_INACTIVE,
            data: 'Your account is inactive. Please contact customer support for assistance.'
        };

        super(data, HttpStatus.BAD_REQUEST);
    }

}
