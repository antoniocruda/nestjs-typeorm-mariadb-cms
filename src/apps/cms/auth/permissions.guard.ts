import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface IRequest {
    user: {
        adminUserId: string;
        name: string;
        adminRoleId: string;
        permissions: string[];
    }
}

@Injectable()
export class PermissionsGuard implements CanActivate {
    
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!permissions || permissions.length === 0) {
            return true;
        }

        const { user }:IRequest = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }

        if (!user.permissions) {
            return false;
        }

        let canAccess: boolean = false;
        let canAndAccess: boolean[] = [];
        for (let i = 0; i < permissions.length; i += 1) {
            const copyPermissions = permissions[i].split(',');

            canAndAccess[i] = true;
            for (let j = 0; j < copyPermissions.length; j += 1) {
                if (!user.permissions.includes(copyPermissions[j])) {
                    canAndAccess[i] = false;
                    break
                }
            }
        }

        if (canAndAccess.includes(true)) {
            canAccess = true;
        }

        return canAccess;
    }

}
