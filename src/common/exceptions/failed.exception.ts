import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../types';

export class FailedException extends HttpException {

    constructor(msg: string, code: ErrorCode = ErrorCode.FAILED) {
        const data = {
            code,
            data: msg
        };

        super(data, HttpStatus.BAD_REQUEST);
    }

}
