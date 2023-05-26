import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RspdButtonComponent } from './button.component';

describe('RspdButtonComponent', () => {
	let component: RspdButtonComponent;
	let fixture: ComponentFixture<RspdButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RspdButtonComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RspdButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
