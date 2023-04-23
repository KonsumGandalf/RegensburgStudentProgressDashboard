import { IsAllowEmailDomain } from '@rspd/user/backend/common-models';
import {
    IsEmail,
    IsString,
    IsStrongPassword,
    MaxLength,
    MinLength,
} from 'class-validator';

export class RegisterUserDto {
    @IsString()
    @IsEmail()
    @IsAllowEmailDomain()
    @MaxLength(64)
    email: string;

    @IsString()
    @MinLength(7)
    @MaxLength(32)
    username: string;

    @IsString()
    @MinLength(3)
    @MaxLength(32)
    firstName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(32)
    lastName: string;

    @IsString()
    @MaxLength(32)
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
    })
    password: string;

    @IsString()
    @MaxLength(32)
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
    })
    confirmPassword: string;
}
