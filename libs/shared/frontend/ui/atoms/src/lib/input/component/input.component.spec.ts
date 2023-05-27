import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RspdInputComponent } from './input.component';

describe('RspdInputComponent', () => {
	let component: RspdInputComponent;
	let fixture: ComponentFixture<RspdInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RspdInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RspdInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
