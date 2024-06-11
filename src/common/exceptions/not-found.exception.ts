import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../types';

export class NotFoundException extends HttpException {

    constructor(msg: string) {
        const data = {
            code: ErrorCode.NOT_FOUND,
            data: msg
        };

        super(data, HttpStatus.BAD_REQUEST);
    }

}
