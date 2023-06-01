import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { IUser } from '@rspd/user/backend/common-models';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IAppConfig } from '../config/app-config.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly _configService: ConfigService<IAppConfig>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: _configService.get('auth', { infer: true })
                .secretOrKey,
        });
    }

    validate(payload: IUser): IUser {
        return payload;
    }
}
