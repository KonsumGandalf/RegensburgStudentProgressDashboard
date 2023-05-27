import { Meta, Story } from '@storybook/angular';

import { IconColor } from '../models/icon-color';
import { IconSize } from '../models/icon-size';
import { OthLogos } from '../models/oth-logos';
import { PhosphorIcons } from '../models/phosphor-icons';
import { TopicIcons } from '../models/topic-icons';
import { RspdIconComponent } from './icon.component';

const topicIcons = {
	javascript: [TopicIcons.JAVASCRIPT],
	robot: [TopicIcons.ROBOT],
	cloud: [TopicIcons.CLOUD],
	python: [TopicIcons.PYTHON],
	sql: [TopicIcons.SQL],
	scratch: [TopicIcons.SCRATCH],
};

export const phosphorIcons = {
	edit: [PhosphorIcons.EDIT],
	lock: [PhosphorIcons.LOCK],
	random: [PhosphorIcons.RANDOM],
	visible: [PhosphorIcons.VISIBLE],
	delete: [PhosphorIcons.DELETE],
	date: [PhosphorIcons.DATE],
	add: [PhosphorIcons.ADD],
	save: [PhosphorIcons.SAVE],
	incorrect: [PhosphorIcons.INCORRECT],
	correct: [PhosphorIcons.CORRECT],
};

const othLogos = {
	rsdsWhite: [OthLogos.RSPD_SIMPLE_BLACK],
	rsdsBlack: [OthLogos.RSPD_SIMPLE_WHITE],
	oth: [OthLogos.OTH],
};

const Template: Story<RspdIconComponent> = (args) => ({
	template: `<rspd-icon [appearance]='appearance' [color]='color' [size]='size'></rspd-icon>`,
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
