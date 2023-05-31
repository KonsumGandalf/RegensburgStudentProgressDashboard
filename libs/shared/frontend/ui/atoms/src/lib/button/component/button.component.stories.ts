import { Meta, Story } from '@storybook/angular';

import { phosphorIcons } from '../../icon/models/phosphor-icons';
import { ButtonAppearance } from '../models/button-appearance';
import { RspdButtonComponent } from './button.component';

const Template: Story<RspdButtonComponent> = (args) => ({
	template: `<button [disabled]='disabled' [appearance]='appearance' [icon]='icon'>
					{{ label }}
				</button>`,
	props: {
		...args,
	},
});
export const Default = Template.bind({});
Default.args = {};

export default {
	title: 'Atoms/Button',
	component: RspdButtonComponent,
	argTypes: {
		appearance: {
			control: { type: 'select' },
			options: Object.values(ButtonAppearance),
		},
		label: {
			control: { type: 'text' },
			description: 'Sets text as label of the button',
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Determines if the button is disabled',
		},
		icon: {
			control: { type: 'select' },
			options: {
				none: null,
				...phosphorIcons,
			},
		},
	},
	args: {
		label: ButtonAppearance.FILLED,
		appearance: ButtonAppearance.FILLED,
		disabled: false,
		icon: null,
	},
} as Meta;
