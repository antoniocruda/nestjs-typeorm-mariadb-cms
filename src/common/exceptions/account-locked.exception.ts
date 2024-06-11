import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../types';

export class AccountLockedException extends HttpException {

    constructor() {
        const data = {
            code: ErrorCode.ACCOUNT_LOCKED,
            data: 'You have reached the maximum number of authentication attempts. Your account has been temporarily locked. Please contact customer support for assistance.'
        };

        super(data, HttpStatus.BAD_REQUEST);
    }

}
