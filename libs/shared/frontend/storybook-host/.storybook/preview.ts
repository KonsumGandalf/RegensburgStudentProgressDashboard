import { setCompodocJson } from '@storybook/angular/dist/client/docs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as documentation from 'libs/shared/frontend/ui/atoms/documentation.json';

setCompodocJson(documentation);

export const parameters = {
	docs: {
		inlineStories: true,
	},
	control: {
		expanded: true,
	},
};
