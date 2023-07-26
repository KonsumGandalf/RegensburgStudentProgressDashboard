import { BaseEntity } from '@rspd/shared/backend/utils';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Student } from './student.entity';

/**
 * Interface representing a GitHub user.
 */
@Entity()
export class GithubUser extends BaseEntity {
	/**
	 * The username of the GitHub user.
	 *
	 * @type {string}
	 */
	@Column({ type: 'varchar' })
	username: string;

	/**
	 * The node ID of the GitHub user.
	 *
	 * @type {string}
	 */
	nodeId: string;

	/**
	 * The URL of the avatar image for the GitHub user.
	 *
	 * @type {string|undefined}
	 */
	@Column({ type: 'varchar', nullable: true })
	avatarUrl?: string;

	/**
	 * The accessToken for GitHub user.
	 *
	 * @type {string}
	 */
	accessToken: string;

    /**
     * The user linked to a githubAccount
     */
	@OneToOne(() => Student)
	@JoinColumn()
	student: Student;
}
