import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when there is no content available.
 * @extends HttpException
 */
export class NoContentException extends HttpException {
    /**
     * Creates a new NoContentException.
     * @param {string} [response='No content found'] - The response message.
     */
    constructor(response = 'No content found') {
        super(response, HttpStatus.NO_CONTENT);
    }
}
