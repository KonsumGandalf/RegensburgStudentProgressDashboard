import { IDropdownItem } from './dropdown-item.interface';

/**
 * Interface representing a navigation bar item.
 */
export interface INavBarItem extends IDropdownItem {
	/**
	 * The router link for the navigation bar item.
	 */
	routerLink: string;

	/**
	 * Indicates whether the navigation bar item is currently active.
	 */
	active: boolean;
}
