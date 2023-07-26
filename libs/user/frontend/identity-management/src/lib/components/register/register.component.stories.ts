import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RspdInputComponent } from '@rspd/shared/frontend/ui/atoms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { RspdRegisterComponent } from './register.component';

const Template: Story<RspdRegisterComponent> = (args) => ({
	template: `<o-rspd-register></o-rspd-register>`,
	props: {
		...args,
	},
});

export const Icon = Template.bind({});
Icon.args = {};

export default {
	title: 'Organisms/Register',
	decorators: [
		moduleMetadata({
			imports: [CommonModule, ReactiveFormsModule, FormsModule, RspdInputComponent],
		}),
	],
	component: RspdRegisterComponent,
	argTypes: {},
	args: {},
} as Meta<RspdRegisterComponent>;
