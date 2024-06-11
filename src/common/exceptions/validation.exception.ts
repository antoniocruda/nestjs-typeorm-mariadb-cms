import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../types';

interface Field {
    field: string;
    errors: string[];
}

export class ValidationException extends HttpException {

    constructor(data: Field[]) {
        const resp = {
            code: ErrorCode.VALIDATION_ERROR,
            data
        };

        super(resp, HttpStatus.BAD_REQUEST);
    }
    
}
