import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../types';

export class AlreadyExistsException extends HttpException {

    constructor(message?: string) {
        const data = {
            code: ErrorCode.ALREADY_EXISTS,
            data: message || 'Data Already exists.',
        };

        super(data, HttpStatus.BAD_REQUEST);
    }

}
