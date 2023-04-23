import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../enums/user-role.enum';

export const Role = (...roles: UserRole[]) => SetMetadata('roles', roles);
