import { NotFoundException } from '@nestjs/common';

import { ActionExceptionType } from '../enums/action-exception.type';
import { ActionObjectType } from '../enums/action-object.type';

export class ActionNotPerformedException extends NotFoundException {
    constructor(
        objectType: ActionObjectType,
        id: number,
        action: ActionExceptionType
    ) {
        super(`${objectType} object with id:${id} could not be ${action}`);
    }
}
