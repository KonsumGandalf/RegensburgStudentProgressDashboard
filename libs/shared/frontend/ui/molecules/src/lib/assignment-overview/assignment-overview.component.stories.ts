import { Meta, Story } from '@storybook/angular';

import { RspdAssignmentOverviewComponent } from './assignment-overview.component';


const Template: Story<RspdAssignmentOverviewComponent> = (args) => ({
	template: `<m-rspd-assignment-overview [keyFigureInput]='args'></m-rspd-assignment-overview>`,
	props: {
		args
	},
});
export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Molecules/AssignmentOverview',
	component: RspdAssignmentOverviewComponent,
	argTypes: {
	},
	args: {
	},
} as Meta;
