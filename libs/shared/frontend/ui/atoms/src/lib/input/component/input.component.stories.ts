import { Meta, Story } from '@storybook/angular';

import { TextField } from '../models/text-field';
import { RspdInputComponent } from './input.component';

const Template: Story<RspdInputComponent> = (args) => ({
	template: `<div style='width: 10rem'>
					<a-rspd-input [label]='label' [supportingText]='supportingText'>
						<input
							class='a-rspd-input__input'
							[placeholder]='label'
							[name]='label'
							[id]='label'
							[type]='pattern'
							[minLength]='minLength'
							[maxLength]='maxLength'
							required
							autocomplete='on'
							/>
					</a-rspd-input>
				</div>`,
	props: {
		...args,
	},
});

export const Default = Template.bind({});
Default.args = {};

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
