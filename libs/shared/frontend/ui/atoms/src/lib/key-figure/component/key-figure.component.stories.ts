import { Meta, Story } from '@storybook/angular';

import { RspdKeyFigureComponent } from './key-figure.component';


const Template: Story<RspdKeyFigureComponent> = (args) => ({
	template: `<a-rspd-key-figure [keyFigureInput]='args'></a-rspd-key-figure>`,
	props: {
		args
	},
});
export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Atoms/Key Figure',
	component: RspdKeyFigureComponent,
	argTypes: {
		current: {
			control: { type: 'number' }
		},
		total: {
			control: { type: 'number' }
		},
		label: {
			control: { type: 'text' }
		},
	},
	args: {
		current: 4,
		total: 7,
		label: 'Total Tests'
	},
} as Meta;
