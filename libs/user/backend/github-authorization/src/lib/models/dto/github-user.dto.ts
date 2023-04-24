import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class GithubUserDto {
    @IsString()
    username: string;

    @IsString()
    nodeId: string;

    @IsString()
    avatarUrl: string;
}
