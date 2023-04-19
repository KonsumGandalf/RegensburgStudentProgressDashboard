import { NotFoundException } from '@nestjs/common';

import { ActionExceptionType } from '../enums/action-exception.type';
import { ActionObjectType } from '../enums/action-object.type';

/**
 * Represents an exception that is thrown when a certain action cannot be performed on an object of a specific type.
 * @extends NotFoundException
 */
export class ActionNotPerformedException extends NotFoundException {
    /**
     * Creates a new ActionNotPerformedException.
     * @param {ActionObjectType} objectType - The type of object on which the action was to be performed.
     * @param {number} id - The ID of the object on which the action was to be performed.
     * @param {ActionExceptionType} action - The type of action that could not be performed.
     */
    constructor(
        objectType: ActionObjectType,
        id: number,
        action: ActionExceptionType
    ) {
        super(`${objectType} object with id:${id} could not be ${action}`);
    }
}
