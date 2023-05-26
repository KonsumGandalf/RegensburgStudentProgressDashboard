import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RspdIconComponent } from './icon.component';

describe('RspdIconComponent', () => {
	let component: RspdIconComponent;
	let fixture: ComponentFixture<RspdIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RspdIconComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RspdIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
