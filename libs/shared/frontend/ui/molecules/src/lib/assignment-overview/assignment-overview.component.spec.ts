import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentOverviewComponent } from './assignment-overview.component';

describe('AssignmentOverviewComponent', () => {
	let component: AssignmentOverviewComponent;
	let fixture: ComponentFixture<AssignmentOverviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AssignmentOverviewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AssignmentOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
