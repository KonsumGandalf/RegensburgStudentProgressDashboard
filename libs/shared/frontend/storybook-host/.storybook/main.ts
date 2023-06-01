import { StorybookConfig } from '@storybook/angular';
import { set } from 'lodash';

const config: StorybookConfig = {
	addons: ['@storybook/addon-essentials', '@storybook/preset-scss'],
	framework: {
		name: '@storybook/angular',
		options: {},
	},
	core: {
		builder: '@storybook/builder-webpack5',
	},
	stories: [
		'../../ui/**/src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)',
		'../../../../user/frontend/**/src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)',
		'../../../../student-submissions/frontend/**/src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)',
	],
	docs: {
		autodocs: true,
		defaultName: 'Docs',
	},
	staticDirs: [
		{ from: '../../assets/src/lib/svgs', to: '/assets/svgs' },
		{ from: '../../assets/src/lib/fonts', to: '/assets/fonts' },
	],
	webpackFinal: async (config) => {
		return config;
	},
};

export default config;
