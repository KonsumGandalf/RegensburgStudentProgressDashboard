import { HttpException, HttpStatus } from '@nestjs/common';

export class NoContentException extends HttpException {
    constructor(response = 'No content found') {
        super(response, HttpStatus.NO_CONTENT);
    }
}
