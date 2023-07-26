import { ConflictException } from '@nestjs/common';

/**
 * Exception thrown when a duplicate source is detected
 *
 * @class
 * @extends {ConflictException}
 */
export class DuplicateSourceException extends ConflictException {
    constructor(source: string) {
        super(`The ${source} is already used by another account`);
    }
}
