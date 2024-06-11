import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';

@JoiSchemaOptions({
    allowUnknown: false
})
export class AddUserToAdminRoleDto {

    @JoiSchema(
        Joie.array()
            .items(Joie.number())
            .required()
    )
    adminUserIds: number[];
    
}