import { WritableSignal } from '@angular/core';
import { IconUnion } from '@rspd/shared/frontend/ui/atoms';

export interface ICardInformation {
	iconLogo: IconUnion;
	isLoading: WritableSignal<boolean>;
	iconSize: string;
}
