import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RspdProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
	let component: RspdProgressBarComponent;
	let fixture: ComponentFixture<RspdProgressBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RspdProgressBarComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RspdProgressBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
