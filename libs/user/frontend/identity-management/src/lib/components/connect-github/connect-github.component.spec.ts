import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectGithubComponent } from './connect-github.component';

describe('ConnectGithubComponent', () => {
	let component: ConnectGithubComponent;
	let fixture: ComponentFixture<ConnectGithubComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConnectGithubComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ConnectGithubComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
