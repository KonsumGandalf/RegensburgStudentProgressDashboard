import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RspdRoundProgressBarComponent } from './round-progress-bar.component';

describe('RspdRoundProgressBarComponent', () => {
	let component: RspdRoundProgressBarComponent;
	let fixture: ComponentFixture<RspdRoundProgressBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RspdRoundProgressBarComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RspdRoundProgressBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
