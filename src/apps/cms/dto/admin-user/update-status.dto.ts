import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joie from '@common/lib/joi.extend';
import { AdminUserStatus } from '@common/entities/admin-user.entity';

@JoiSchemaOptions({
    allowUnknown: false
})
export class UpdateStatusDto {

    @JoiSchema(
        Joie.string()
            .required()
            .valid('active', 'inactive', 'locked')
    )
    status: AdminUserStatus;
    
}