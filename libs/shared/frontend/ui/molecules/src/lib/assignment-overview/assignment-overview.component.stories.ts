import { topicIcons } from '@rspd/shared/frontend/ui/atoms';
import { Meta, Story } from '@storybook/angular';

import { RspdAssignmentOverviewComponent } from './assignment-overview.component';

const Template: Story<RspdAssignmentOverviewComponent> = (args) => ({
	template: `<m-rspd-assignment-overview [name]='name' [icon]='icon' [progress]='progress'></m-rspd-assignment-overview>`,
	props: {
		...args
	},
});
export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Molecules/Assignment Overview',
	component: RspdAssignmentOverviewComponent,
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: {
				...topicIcons,
			},
		},
		name: {
			control: { type: 'text' },
		},
		current: {
			control: { type: 'number' }
		},
		total: {
			control: { type: 'number' }
		},
		isCompleted: {control: { type: 'boolean'}}
	},
	args: {
		name: 'Hello',
		icon: topicIcons.python,
		progress: {
			current: 2,
			total: 3,
			isCompleted: true,
		}
	},
} as Meta;
