import { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
	addons: ['@storybook/addon-essentials'],
	framework: {
		name: '@storybook/angular',
		options: {},
	},
	core: {
		builder: '@storybook/builder-webpack5',
	},
	stories: ['../../ui/**/src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
	docs: {
		autodocs: true,
		defaultName: 'Docs',
	},
	webpackFinal: async (config) => {
		return config;
	},
};

export default config;
