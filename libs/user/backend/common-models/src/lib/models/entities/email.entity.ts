import { BaseEntity } from '@rspd/shared/backend/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IEmail } from '../interfaces/email.interface';

@Entity()
export class Mail extends BaseEntity implements IEmail {
	/**
	 * The primary email address of the user.
	 *
	 * @type {string}
	 */
	@PrimaryColumn()
	email: string;

	/**
	 * The indicator if an accounts email has been confirmed
	 *
	 * @type{boolean}
	 */
	@Column({ type: 'boolean', default: false })
	isEmailValidated: boolean;
}
