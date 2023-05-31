import { Meta, Story } from '@storybook/angular';

import { RspdTabComponent } from './tab.component';
const Template: Story<RspdTabComponent> = (args) => ({
	template: `<a src='https://codepen.io/' [active]='active'>Tab</a>`,
	props: {
		...args,
	},
});

export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Atoms/Tab',
	component: RspdTabComponent,
	argTypes: {
		active: { type: 'boolean'},
	},
	args: {
		active: true,
	},
} as Meta<RspdTabComponent>;
