import { Meta, Story } from '@storybook/angular';

import { RspdLoadingIndicatorComponent } from './loading-indicator.component';
const Template: Story<RspdLoadingIndicatorComponent> = (args) => ({
	template: `<a-rspd-loading-indicator></a-rspd-loading-indicator>`,
	props: {
		...args,
	},
});

export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Atoms/Loading Indicator',
	component: RspdLoadingIndicatorComponent,
	argTypes: {},
	args: {},
} as Meta<RspdLoadingIndicatorComponent>;
