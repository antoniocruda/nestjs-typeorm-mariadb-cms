import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
    id: number;
    name: string;
    permissions: string[];
}

export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext): JwtUser|null => {
        const user = ctx.switchToHttp().getRequest().user;
        
        if (!user) {
            return null;
        }
        
        return data ? user[data] : user;
    }
);
