import { INavBarItem } from './nav-bar.interface';

export const NOT_AUTHENTICATED_NAV_BAR_ITEMS: INavBarItem[] = [
	{ label: 'NAVIGATION.LINKS.HOME', routerLink: '/', active: false },
	{ label: 'NAVIGATION.LINKS.LOGIN', routerLink: '/login', active: false },
	{ label: 'NAVIGATION.LINKS.REGISTER', routerLink: '/register', active: false },
]
