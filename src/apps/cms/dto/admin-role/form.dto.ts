import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class FormDto {
    
    @JoiSchema(
        Joie.string()
            .required()
            .max(100)
    )
    name: string;

    @JoiSchema(
        Joie.string()
            .required()
            .max(250)
    )
    description: string;

    @JoiSchema(
        Joie.array()
            .items(Joie.string())
            .required()
    )
    permissions: string[];

}