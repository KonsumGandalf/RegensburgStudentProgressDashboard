import { Meta, Story } from '@storybook/angular';

import { CardAppearance } from '../../card/models/card-appearance';
import { CardPadding } from '../../card/models/card-padding';
import { TextField, TextFieldType } from '../models/text-field';
import { RspdInputComponent } from './input.component';

const Template: Story<RspdInputComponent> = (args) => ({
	template: `<div style='width: 10rem'>
			<a-rspd-input [label]='label' 
			[maxLength]='maxLength' 
			[minLength]='minLength'
			[supportingText]='supportingText'
			[pattern]='pattern'
			/>
		</div>`,
	props: {
		...args,
	},
});

export const Icon = Template.bind({});
Icon.args = {};

export default {
	title: 'Atoms/Input',
	component: RspdInputComponent,
	argTypes: {
		label: {
			control: { type: 'text' },
		},
		maxLength: {
			control: { type: 'number' },
		},
		minLength: {
			control: { type: 'number' },
		},
		supportingText: {
			control: { type: 'text' },
		},
		pattern: {
			control: { type: 'select' },
			options: Object.values(TextField),
		},
	},
	args: {
		label: 'password',
		maxLength: 10,
		minLength: 3,
		supportingText: 'dont choose your real name',
		pattern: 'password',
	},
} as Meta<RspdInputComponent>;
