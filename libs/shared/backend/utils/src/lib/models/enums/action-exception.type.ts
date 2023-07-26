/**
 * Enum representing the type of exception that can be thrown when an action fails to be performed.
 * @readonly
 * @enum {string}
 */
export enum ActionExceptionType {
    /**
     * Exception thrown when an update action fails to be performed.
     */
    UPDATE = 'updated',

    /**
     * Exception thrown when a delete action fails to be performed.
     */
    DELETE = 'deleted',

    /**
     * Exception thrown when a create action fails to be performed.
     */
    CREATE = 'create',
}
