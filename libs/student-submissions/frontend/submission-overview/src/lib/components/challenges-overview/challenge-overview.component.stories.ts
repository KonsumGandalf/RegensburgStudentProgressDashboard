import { SubmissionState } from '@rspd/student-submissions/backend/common-models';
import { IAssignmentOverview } from '@rspd/student-submissions/common/models';
import { Meta, Story } from '@storybook/angular';

import { RspdChallengeOverviewComponent } from './challenge-overview.component';

const ASSIGNMENTS: IAssignmentOverview[] = [];

const Template: Story<RspdChallengeOverviewComponent> = (args) => ({
	template: `<o-rspd-challenge-overview></o-rspd-challenge-overview>`,
	props: {
		args
	},
});
export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Organisms/Challenge Overview',
	component: RspdChallengeOverviewComponent,
	argTypes: {
		name: {
			control: { type: 'number' }
		},
		targetedCompletionDate: {
			control: { type: 'date' }
		},
		completionState: {control: { type: 'boolean'}},
	},
	args: {
		name: 'Einführung in die Programmierung',
		total: new Date(),
		isCompleted: SubmissionState.CompletelySolved
	},
} as Meta;
