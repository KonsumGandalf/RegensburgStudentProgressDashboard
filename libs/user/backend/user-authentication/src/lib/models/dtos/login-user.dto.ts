import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @MinLength(7)
    @MaxLength(32)
    username: string;

    @IsString()
    @MinLength(7)
    @MaxLength(32)
    password: string;
}
