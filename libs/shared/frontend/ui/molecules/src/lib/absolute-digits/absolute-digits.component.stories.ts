import { IKeyFigure } from '@rspd/shared/frontend/ui/atoms';
import { Meta, Story } from '@storybook/angular';

import { RspdAbsoluteDigitsComponent } from './absolute-digits.component';

const multipleItems: IKeyFigure[] = [];
for (let i = 0; i < 4; i++) {
	multipleItems.push({
		current: 2,
		total: 4,
		label: 'Solved Assignments',
	});
}
const Template: Story<RspdAbsoluteDigitsComponent> = (args) => ({
	template: `<m-rspd-absolute-digits [absoluteDigits]='args'></m-rspd-absolute-digits>`,
	props: {
		args: args.absoluteDigits,
	},
});
export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Molecules/Absolute Digits',
	component: RspdAbsoluteDigitsComponent,
	argTypes: {},
	args: {
		absoluteDigits: multipleItems,
	},
} as Meta;
