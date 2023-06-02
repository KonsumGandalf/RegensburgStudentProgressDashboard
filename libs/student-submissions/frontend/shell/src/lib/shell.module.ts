import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RspdSubmissionsOverviewPage } from './pages/overview/submissions-overview.page';
import { SHELL_ROUTES } from './shell.routes';

@NgModule({
	imports: [CommonModule, RouterModule.forChild(SHELL_ROUTES)],
	declarations: [RspdSubmissionsOverviewPage],
})
export class RspdStudentSubmissionsShellModule {}
