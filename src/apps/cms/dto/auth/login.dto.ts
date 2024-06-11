import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class LoginDto {

    @JoiSchema(
        Joie.string()
            .required()
    )
    username: string;

    @JoiSchema(
        Joie.string()
            .required()
    )
    password: string;

}