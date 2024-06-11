import {
    Body,
    Controller,
    Post,
    Put,
    UseGuards
} from '@nestjs/common';
import { CurrentUser, JwtUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChangePasswordDto } from '../dto/auth/change-password.dto';
import { AuthService } from '../services/auth.service';
import { RefreshSessionDto } from '../dto/auth/refresh-session.dto';
import { LogoutDto } from '../dto/auth/logout.dto';
import { LoginDto } from '../dto/auth/login.dto';

@Controller()
export class AuthController {
    
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('auth/login')
    async login(
        @Body() dto: LoginDto
    ) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('auth/logout')
    async logout(
        @Body() dto: LogoutDto
    ) {
        await this.authService.logout(dto);

        return 'OK';
    }

    @UseGuards(JwtAuthGuard)
    @Put('auth/change-password')
    async changePassword(
        @Body() dto: ChangePasswordDto,
        @CurrentUser() currentUser: JwtUser
    ) {
        await this.authService.changePassword(currentUser.id, dto);

        return 'OK';
    }

    @Post('auth/refresh-session')
    refreshSession(
        @Body() dto: RefreshSessionDto
    ) {
        return this.authService.refreshSession(dto);
    }

}
