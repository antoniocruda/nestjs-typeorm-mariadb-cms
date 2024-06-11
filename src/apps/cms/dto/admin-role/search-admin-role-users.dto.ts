import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: true
})
export class SearchAdminRoleUsersDto {

    @JoiSchema(
        Joie.number()
            .optional()
            .min(5)
            .max(1000)
    )
    limit?: number;

    @JoiSchema(
        Joie.string()
            .optional()
            .allow('')
    )
    keyword?: string;
    
}