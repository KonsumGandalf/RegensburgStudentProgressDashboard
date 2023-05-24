import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppRootLayout } from './root.layout';

describe('AppRootLayout', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppRootLayout, RouterTestingModule],
		}).compileComponents();
	});
});
