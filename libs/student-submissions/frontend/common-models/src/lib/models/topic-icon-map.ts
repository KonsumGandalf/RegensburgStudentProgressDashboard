import { IconUnion, TopicIcons } from '@rspd/shared/frontend/ui/atoms';
import { AssignmentTopic } from '@rspd/student-submissions/common/models';

export const TOPIC_ICON_MAP: Record<AssignmentTopic, TopicIcons> = {
	[AssignmentTopic.SQL]: TopicIcons.SQL,
	[AssignmentTopic.WEB]: TopicIcons.JAVASCRIPT,
	[AssignmentTopic.ROBOTIC]: TopicIcons.ROBOT,
	[AssignmentTopic.FLASK]: TopicIcons.PYTHON,
	[AssignmentTopic.PYTHON]: TopicIcons.PYTHON,
	[AssignmentTopic.SCRATCH]: TopicIcons.SCRATCH,
	[AssignmentTopic.IOT]: TopicIcons.CLOUD,
}
