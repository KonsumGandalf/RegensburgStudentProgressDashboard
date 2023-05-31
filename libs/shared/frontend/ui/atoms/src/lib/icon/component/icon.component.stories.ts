import { Meta, Story } from '@storybook/angular';

import { IconColor } from '../models/icon-color';
import { IconSize } from '../models/icon-size';
import { OthLogos, othLogos } from '../models/oth-logos';
import { PhosphorIcons, phosphorIcons } from '../models/phosphor-icons';
import { TopicIcons, topicIcons } from '../models/topic-icons';
import { RspdIconComponent } from './icon.component';

const Template: Story<RspdIconComponent> = (args) => ({
	template: `<a-rspd-icon [appearance]='appearance' [color]='color' [size]='size'></a-rspd-icon>`,
	props: {
		...args,
	},
});

export const Icon = Template.bind({});
Icon.args = {};

export default {
	title: 'Atoms/Icon',
	component: RspdIconComponent,
	argTypes: {
		size: {
			control: { type: 'select' },
			options: Object.values(IconSize),
		},
		appearance: {
			control: { type: 'select' },
			options: {
				...phosphorIcons,
				...topicIcons,
				...othLogos,
			},
		},
		color: {
			control: { type: 'select' },
			options: Object.values(IconColor),
		},
		isColored: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		size: IconSize.MD,
		appearance: PhosphorIcons.EDIT,
		color: IconColor.BLACK,
	},
} as Meta<RspdIconComponent>;
