import { OthLogos, othLogos } from '@rspd/shared/frontend/ui/atoms';
import { Meta, Story } from '@storybook/angular';

import { RspdVerificationComponent } from './verification.component';

const Template: Story<RspdVerificationComponent> = (args) => ({
	template: `<o-rspd-verification [headerLogo]='headerLogo' [title]='title'></o-rspd-verification>`,
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
	},
	args: {
		headerLogo: OthLogos.OTH,
		title: 'Verification',
	},
} as Meta<RspdVerificationComponent>;
