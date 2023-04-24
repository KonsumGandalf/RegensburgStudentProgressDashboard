import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubUser } from '@rspd/shared/backend/utils';
import {
    RspdUserModule,
    UserService,
} from '@rspd/user/backend/user-management';

import { GithubAccountController } from './controller/github-account.controller';
import { GithubAccountService } from './services/github-account.service';

@Module({
    imports: [RspdUserModule, TypeOrmModule.forFeature([GithubUser])],
    controllers: [GithubAccountController],
    providers: [GithubAccountService],
    exports: [RspdGithubModule],
})
export class RspdGithubModule {}

/**
 }interface IRegisterModuleOption {
    imports?: ModuleMetadata['imports'];
    assignments: Partial<Record<AssignmentType, Type<AssignmentProvider>>>;
}
 *
 *     public static register(options: IRegisterModuleOption): DynamicModule {
 *         const moduleProviders = Object.entries(options.assignments).map(
 *             ([type, assignmentClass]: [
 *                 AssignmentType,
 *                 Type<AssignmentProvider>
 *             ]) => ({
 *                 provide: getAssignmentProviderToken(type),
 *                 useClass: assignmentClass,
 *             })
 *         );
 *
 *         return {
 *             module: RspdGradeModule,
 *             imports: options.imports,
 *             providers: [...moduleProviders],
 *         };
 *     }
 */
