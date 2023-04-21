import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { IUser } from '@rspd/shared/backend/utils';
import { IComplexUser } from '@rspd/user/backend/user-management';

import { RegisterUserDto } from '../models/dtos/register-user.dto';
import { JwtAuthGuard } from '../models/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../models/guards/local-auth.guard';
import { IRequestLogin } from '../models/interfaces/request-login.interface';
import { IResponseLogin } from '../models/interfaces/response-login.interfaces';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('/register')
    register(@Body() userDto: RegisterUserDto): Promise<IComplexUser> {
        return this._authService.register(userDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() request: IRequestLogin): Promise<IResponseLogin> {
        return await this._authService.login({
            username: request.user.username,
            id: request.user.id,
        } as IUser);
    }

    @UseGuards(JwtAuthGuard)
    @Get('whoami')
    async whoami(@Request() req) {
        return req.user;
    }
}
