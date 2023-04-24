import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@rspd/user/backend/common-models';

import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [RspdUserModule, UserService],
})
export class RspdUserModule {}
