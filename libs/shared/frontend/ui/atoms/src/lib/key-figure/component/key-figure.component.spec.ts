import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RspdKeyFigureComponent } from './key-figure.component';

describe('RspdKeyFigureComponent', () => {
	let component: RspdKeyFigureComponent;
	let fixture: ComponentFixture<RspdKeyFigureComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RspdKeyFigureComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RspdKeyFigureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
