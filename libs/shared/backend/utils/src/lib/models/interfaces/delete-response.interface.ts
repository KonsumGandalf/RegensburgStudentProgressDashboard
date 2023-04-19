/**
 * Interface for response object when deleting data
 * @interface
 */
export interface IDeleteResponse<DeletedType> {
    /**
     * The number of affected rows in the database
     * @member {number}
     */
    affectedRows: number;

    /**
     * The deleted elements returned as an unknown object
     */
    deletedElements: DeletedType;
}
