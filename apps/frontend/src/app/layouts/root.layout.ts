import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppTranslationModule } from '../translation/translation.module';

@Component({
	standalone: true,
	imports: [CommonModule, RouterModule, AppTranslationModule],
	selector: 'rspd-root',
	templateUrl: './root.layout.html',
	styleUrls: ['./root.layout.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRootLayout {}
