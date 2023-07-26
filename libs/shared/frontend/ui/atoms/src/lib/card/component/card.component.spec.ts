import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RspdCardComponent } from './card.component';

describe('RspdCardComponent', () => {
	let component: RspdCardComponent;
	let fixture: ComponentFixture<RspdCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RspdCardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RspdCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
