import { IScoreOf } from '../score-of.interface';

/**
 * Represents the absolute progress overview, which is displayed in the frontend
 */
export interface IAbsoluteProgressOverview {
	test: IScoreOf;
	assignment: IScoreOf;
	challenge: IScoreOf;
}
