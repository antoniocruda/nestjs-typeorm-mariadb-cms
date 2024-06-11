import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class ChangePasswordDto {
    
    @JoiSchema(
        Joie.string()
            .required()
    )
    oldPassword: string;

    @JoiSchema(
        Joie.string()
            .required()
    )
    password: string;

}