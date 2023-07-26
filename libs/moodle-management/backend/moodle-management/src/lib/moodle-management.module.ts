import { Module } from '@nestjs/common';
import { RspdMoodleRequestHandlerModule } from '@rspd/moodle-management/backend/moodle-request-handler';

import { MoodleManagementController } from './controller/moodle-management.controller';
import { MoodleManagementService } from './services/moodle-management.service';

@Module({
	imports: [RspdMoodleRequestHandlerModule],
	controllers: [MoodleManagementController],
	providers: [MoodleManagementService],
	exports: [MoodleManagementService],
})
export class RspdMoodleManagementModule {}
