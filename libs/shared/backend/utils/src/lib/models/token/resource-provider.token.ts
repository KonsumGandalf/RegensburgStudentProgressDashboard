import { ResourceProvider } from '../enums/resource-provider.enum';

export const RESOURCE_PROVIDER_TOKEN = (serviceName: ResourceProvider) =>
	`SERVICE_TOKEN_${serviceName}`;
