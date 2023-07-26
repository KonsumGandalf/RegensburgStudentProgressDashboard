import { IconSize, OthLogos, othLogos, phosphorIcons } from '@rspd/shared/frontend/ui/atoms';
import { Meta, Story } from '@storybook/angular';

import { RspdVerificationComponent } from './verification.component';

const Template: Story<RspdVerificationComponent> = (args) => ({
	template: `<o-rspd-verification [headerLogo]='headerLogo' [title]='title' [size]='size' [isLoading]='isLoading'></o-rspd-verification>`,
	props: {
		...args,
	},
});

export const Icon = Template.bind({});
Icon.args = {};

export default {
	title: 'Organisms/Verification',
	component: RspdVerificationComponent,
	argTypes: {
		headerLogo: {
			control: { type: 'select' },
			options: {
				...phosphorIcons,
				...othLogos,
			},
		},
		title: {
			control: { type: 'text' },
		},
		_buttonAppearance: {
			table: {
				disable: true,
			},
		},
		isLoading: {
			control: { type: 'boolean' },
		},
		size: {
			control: { type: 'select' },
			options: [...Object.values(IconSize), '100%'],
		},
	},
	args: {
		headerLogo: OthLogos.OTH,
		title: 'Verification',
		isLoading: false,
		size: '100%',
	},
} as Meta<RspdVerificationComponent>;
