import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class RefreshSessionDto {

    @JoiSchema(
        Joie.string()
            .required()
    )
    refreshToken: string;

}
