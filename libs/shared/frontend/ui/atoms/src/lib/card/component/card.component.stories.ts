import { RspdButtonComponent } from '@rspd/shared/frontend/ui/atoms';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { ButtonAppearance } from '../../button/models/button-appearance';
import { OthLogos } from '../../icon/models/oth-logos';
import { CardAppearance } from '../models/card-appearance';
import { RspdCardComponent } from './card.component';

const Template: Story<RspdCardComponent> = (args) => ({
	template: `<a-rspd-card style='min-height: 5rem' [appearance]='appearance'>
				</a-rspd-card>`,
	props: {
		...args,
	},
});
export const Default = Template.bind({});
Default.args = {};

const TemplateWithContent: Story<RspdCardComponent> = (args) => ({
	template: `<a-rspd-card [appearance]='appearance'>
					<a-rspd-button [appearance]='buttonAppearance'>Filled</a-rspd-button>
					<a-rspd-button [appearance]='buttonAppearance'>Filled</a-rspd-button>
					<a-rspd-button [appearance]='buttonAppearance'>Filled</a-rspd-button>
				</a-rspd-card>`,
	props: {
		...args,
	},
});
export const WithContent = TemplateWithContent.bind({});
WithContent.args = {};

const TemplateWithHeaderAndContent: Story<RspdCardComponent> = (args) => ({
	template: `<a-rspd-card [appearance]='appearance' [icon]='icon'>
					<a-rspd-button [appearance]='buttonAppearance'>Filled</a-rspd-button>
					<a-rspd-button [appearance]='buttonAppearance'>Filled</a-rspd-button>
					<a-rspd-button [appearance]='buttonAppearance'>Filled</a-rspd-button>
				</a-rspd-card>`,
	props: {
		...args,
	},
});
export const WithHeaderAndContent = TemplateWithHeaderAndContent.bind({});
WithContent.args = {};

export default {
	title: 'Atoms/Card',
	component: RspdCardComponent,
	decorators: [moduleMetadata({ imports: [RspdButtonComponent] })],
	argTypes: {
		appearance: {
			control: { type: 'select' },
			options: Object.values(CardAppearance),
		},
		buttonAppearance: {
			table: {
				disable: true,
			},
		},
		icon: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		appearance: CardAppearance.RAISED,
		buttonAppearance: ButtonAppearance.OUTLINED,
		icon: OthLogos.OTH,
	},
} as Meta;
