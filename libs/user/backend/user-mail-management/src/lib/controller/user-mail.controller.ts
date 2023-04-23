import { Controller } from '@nestjs/common';

import { UserMailService } from '../services/user-mail.service';

@Controller()
export class UserMailController {
    constructor(private readonly _userMailService: UserMailService) {}
}
