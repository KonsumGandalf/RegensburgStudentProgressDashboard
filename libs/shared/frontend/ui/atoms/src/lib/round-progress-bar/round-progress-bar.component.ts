import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { RspdIconComponent } from '@rspd/shared/frontend/ui/atoms';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PERCENTAGE_NAME_MAP } from './models/percentage-name';

@Component({
    selector: 'a-rspd-round-progress-bar',
    standalone: true,
    imports: [CommonModule, RoundProgressModule, RspdIconComponent],
    templateUrl: './round-progress-bar.component.html',
    styleUrls: ['./round-progress-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'a-rspd-round-progress-bar'
    }
})
export class RspdRoundProgressBarComponent {
    @Input({ required: true })
    headline!: string;

    caption!: string;

    protected _progressPercentage!: number;

    @Input({ required: true })
    set progressPercentage(percentage: number) {
        this._progressPercentage = Math.min(Math.max(percentage, 0), 1);
        for (const percentage in PERCENTAGE_NAME_MAP) {
            if (this._progressPercentage >= Number(percentage)) {
                this.caption = PERCENTAGE_NAME_MAP[percentage];
            }
        }

    }

    get progressPercentage() {
        return this._progressPercentage;
    }
}
