
import { Request } from 'express';
import Joi from 'joi';

export interface ProcessedValidationError {
    field: string;
    errors: string[];
}

export class CommonUtil {
    static camelToSnakeCase(str:string): string {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    static objectPropsCamelToSnakeCase(
        obj:Record<string, unknown>,
        removeObjectValue = true,
        prefix = '',
        convertWithPrefixFields = ['id']
    ) {
        const newObj = {};

        for (const x in obj) {
            if (
                typeof x === 'string'
                && (
                    !removeObjectValue
                    || typeof obj[x] !== 'object'
                    || Array.isArray(obj[x])
                )
            ) {
                const key = (convertWithPrefixFields.includes(x) && prefix !== '') ? `${prefix}_${x}` : x;

                newObj[this.camelToSnakeCase(key)] = obj[x];
            }
        }

        return newObj;
    }

    static imageFileFilter(req: Request, file: Express.Multer.File, cb: (err:Error|null, status:boolean) => void) {
        const supportedImageMimeTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

        if (!supportedImageMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Extension not allowed'), false);
        }
    
        return cb(null, true);
    }

    static csvFileFilter(req: Request, file: Express.Multer.File, cb: (err:Error|null, status:boolean) => void) {
        const supportedImageMimeTypes = ['text/csv'];

        if (!supportedImageMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Extension not allowed'), false);
        }
    
        return cb(null, true);
    }

    static processValidationErrors(errs: Joi.ValidationErrorItem[]): ProcessedValidationError[] {
        const response:ProcessedValidationError[] = [];
        for (const err of errs) {
            response.push({
                field: err.context.key,
                errors: [err.message]
            });
        }
    
        return response;
    }
}