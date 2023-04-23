import { Column, Entity } from 'typeorm';

import { IGithubUser } from '../interfaces/github-user.interface';
import { BaseEntity } from './base.entity';

/**
 * Interface representing a GitHub user.
 */
@Entity()
export class GithubUser extends BaseEntity implements IGithubUser {
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
     * The URL of the avatar image for the GitHub user.
     *
     * @type {string|undefined}
     */
    accessToken: string;
}
