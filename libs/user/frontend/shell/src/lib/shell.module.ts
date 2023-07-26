import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RspdIdentityModule } from '@rspd/user/frontend/identity-management';

import { RspdUserPage } from './page/user.page';
import { SHELL_ROUTES } from './shell.routes';

@NgModule({
	imports: [CommonModule, RouterModule.forChild(SHELL_ROUTES), RspdIdentityModule],
	declarations: [RspdUserPage],
})
export class RspdUserShellModule {}
