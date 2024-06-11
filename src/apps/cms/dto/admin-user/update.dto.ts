import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class UpdateDto {
    
    @JoiSchema(
        Joie.string()
            .required()
            .max(50)
    )
    username: string;

    @JoiSchema(
        Joie.string()
            .required()
            .max(150)
    )
    name: string;

    @JoiSchema(
        Joie.string()
            .email()
            .max(250)
            .allow('')
    )
    email: string;

}