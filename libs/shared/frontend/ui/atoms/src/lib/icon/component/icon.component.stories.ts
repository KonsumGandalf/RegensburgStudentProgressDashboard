import { Meta, Story } from '@storybook/angular';

import { IconColor } from '../models/icon-color';
import { IconSize } from '../models/icon-size';
import { PhosphorIcons } from '../models/phosphor-icons';
import { TopicIcons } from '../models/topic-icons';
import { RspdIconComponent } from './icon.component';

const topicIcons = {
	javascript: [TopicIcons.javascript],
	robot: [TopicIcons.robot],
	cloud: [TopicIcons.cloud],
	python: [TopicIcons.python],
	sql: [TopicIcons.sql],
	scratch: [TopicIcons.scratch],
};

export const phosphorIcons = {
	edit: [PhosphorIcons.edit],
	lock: [PhosphorIcons.lock],
	random: [PhosphorIcons.random],
	visible: [PhosphorIcons.visible],
	delete: [PhosphorIcons.delete],
	date: [PhosphorIcons.date],
	add: [PhosphorIcons.add],
	save: [PhosphorIcons.save],
	incorrect: [PhosphorIcons.incorrect],
	correct: [PhosphorIcons.correct],
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
		appearance: PhosphorIcons.edit,
		color: IconColor.BLACK,
	},
} as Meta<RspdIconComponent>;
