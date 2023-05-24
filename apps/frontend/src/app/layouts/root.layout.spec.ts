import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AppComponent } from '../app.component';
import { AppRootLayout } from './root.layout';

describe('AppRootLayout', () => {
	let fixture: ComponentFixture<AppRootLayout>;
	let component: AppRootLayout;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CommonModule, RouterTestingModule, TranslateModule.forRoot()],
		}).compileComponents();
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AppComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
	});

	it('should create the app component', () => {
		expect(component).toBeTruthy();
	});
});
