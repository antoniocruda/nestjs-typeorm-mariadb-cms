import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class LogoutDto {

    @JoiSchema(
        Joie.string()
            .required()
    )
    refreshToken: string;

}
