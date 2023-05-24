import { StorybookConfig } from '@storybook/angular';
import { set } from 'lodash';

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
		set(
			config,
			['resolve', 'alias', 'settings/vendors/bootstrap'],
			'libs/shared/common/styles/src/scss/settings/vendors/_bootstrap.scss',
		);

		return config;
	},
};

export default config;
