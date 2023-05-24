import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { ButtonComponent } from './button.component';

export default {
	title: 'Button',
	component: ButtonComponent,
	decorators: [
		moduleMetadata({
			imports: [CommonModule],
		}),
	],
} as Meta;

const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
	component: ButtonComponent,
	props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
