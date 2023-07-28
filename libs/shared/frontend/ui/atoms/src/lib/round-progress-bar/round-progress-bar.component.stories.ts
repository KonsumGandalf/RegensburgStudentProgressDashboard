import { SubmissionState } from '@rspd/student-submissions/common/models';
import { Meta, Story } from '@storybook/angular';

import { RspdRoundProgressBarComponent } from './round-progress-bar.component';

const Template: Story<RspdRoundProgressBarComponent> = (args) => ({
    template: `<a-rspd-round-progress-bar 
                [progressPercentage]='progressPercentage' 
                [caption]="caption" 
                [headline]="headline"></a-rspd-round-progress-bar>`,
    props: {
        ...args
    }
});
export const Default = Template.bind({});
Default.args = {};

const topics = [
    { headline: 'Python', caption: 'Elite Vanguard', progressPercentage: 0.65 },
    { headline: 'Scratch', caption: 'Supreme Pioneer', progressPercentage: 0.8 },
    { headline: 'SQL', caption: 'Novice Explorer', progressPercentage: 0.2 },
    { headline: 'Web', caption: 'Novice Explorer', progressPercentage: 0 },
] as RspdRoundProgressBarComponent[]

const Topcis :  Story<RspdRoundProgressBarComponent> = () => ({
    template: `<div>
                    <a-rspd-round-progress-bar 
                        [progressPercentage]="topic.progressPercentage"
                        [caption]="topic.caption" 
                        [headline]="topic.headline"
                        *ngFor="let topic of topics">
                    </a-rspd-round-progress-bar>
                </div>`,
    props: {
        topics: topics
    }
});

export const TopicsLine = Topcis.bind({});
TopicsLine.args = {};

export default {
    title: 'Atoms/Round Progress Bar',
    component: RspdRoundProgressBarComponent,
    argTypes: {
        progressPercentage: {
            control: {
                type: 'number',
                min: 0,
                max: 1,
                step: 0.05
            }
        },
        headline: {
            control: { type: 'text' }
        },
        caption: {
            control: { type: 'text' }
        },
        _progressPercentage: {
            table: {
                disable: true
            }
        },
        getSize: {
            table: {
                disable: true
            }
        }
    },
    args: {
        progressPercentage: 0.5,
        headline: 'Python',
        caption: 'Elite Vanguard'
    }
} as Meta;
