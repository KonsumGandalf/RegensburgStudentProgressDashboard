import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MoodleRequestHandlerService } from './services/moodle-request-handler.service';

@Module({
	imports: [HttpModule],
	controllers: [],
	providers: [MoodleRequestHandlerService],
	exports: [MoodleRequestHandlerService],
})
export class RspdMoodleRequestHandlerModule {}
