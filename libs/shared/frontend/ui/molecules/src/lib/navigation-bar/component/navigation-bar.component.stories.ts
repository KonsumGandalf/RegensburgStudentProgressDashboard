import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { RspdNavigationBarComponent } from './navigation-bar.component';


const Template: Story<RspdNavigationBarComponent> = (args) => ({
	template: `<m-rspd-nav-bar></m-rspd-nav-bar>`,
	props: {
		...args,
	},
});
export const Default = Template.bind({});
Default.args = {};


export default {
	title: 'Molecules/Navigation Bar',
	component: RspdNavigationBarComponent,
	decorators: [moduleMetadata({ imports: [RspdNavigationBarComponent] })],
	argTypes: {
	},
	args: {
	},
} as Meta;
