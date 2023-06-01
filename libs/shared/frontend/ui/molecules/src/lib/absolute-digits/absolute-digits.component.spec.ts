import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbsoluteDigitsComponent } from './absolute-digits.component';

describe('AbsoluteDigitsComponent', () => {
	let component: AbsoluteDigitsComponent;
	let fixture: ComponentFixture<AbsoluteDigitsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AbsoluteDigitsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AbsoluteDigitsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
