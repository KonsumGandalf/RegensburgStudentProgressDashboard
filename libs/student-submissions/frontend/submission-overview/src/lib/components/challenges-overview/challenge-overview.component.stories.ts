import {
	AssignmentTopic,
	IAssignmentOverview,
	IChallengeSubmissionOverview,
	SubmissionState,
} from '@rspd/student-submissions/common/models';
import { Meta, Story } from '@storybook/angular';

import { RspdChallengeOverviewComponent } from './challenge-overview.component';

const assignments: IAssignmentOverview[] = [];
for (let i = 0; i < 3; i++) {
	assignments.push({
		id: '',
		name: 'Hello',
		displayName: 'Hello',
		topics: [AssignmentTopic.PYTHON],
		completionState: SubmissionState.Solved,
		assignmentScore: {
			all: 5,
			solved: 4
		}
	})
}

const Template: Story<RspdChallengeOverviewComponent> = (args) => ({
	template: `<o-rspd-challenge-overview [overviewInput]='args'></o-rspd-challenge-overview>`,
	props: {
		args,
	},
});
export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Organisms/Challenge Overview',
	component: RspdChallengeOverviewComponent,
	argTypes: {
		name: {
			control: { type: 'text' },
		},
		targetedCompletionDate: {
			control: { type: 'date' },
		},
		completionState: {
			control: { type: 'select' },
			options: Object.values(SubmissionState)
		},
	},
	args: {
		challengeScore: {
			solved: 5,
			all: 8,
		},
		name: 'Einführung in die Programmierung',
		targetedCompletionDate: new Date(),
		completionState: SubmissionState.CompletelySolved,
		assignments: assignments,
	} as IChallengeSubmissionOverview,
} as Meta;
