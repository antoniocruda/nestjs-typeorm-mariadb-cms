import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class SearchDto {

    @JoiSchema(
        Joie.number()
            .optional()
            .min(5)
            .max(100)
    )
    limit?: number;

    @JoiSchema(
        Joie.number()
            .optional()
            .min(1)
    )
    page?: number;

    @JoiSchema(
        Joie.string()
            .optional()
            .allow('')
    )
    keyword?: string;

}