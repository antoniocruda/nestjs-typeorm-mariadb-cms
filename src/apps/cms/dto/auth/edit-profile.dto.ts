import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class EditProfileDto {

    @JoiSchema(
        Joie.string()
            .required()
            .max(150)
    )
    name: string;

}