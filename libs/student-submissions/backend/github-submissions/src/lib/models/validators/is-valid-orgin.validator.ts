import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

const allowedProviders = ['//github.com'];

export function IsValidOrgin(validationOptions?: ValidationOptions) {
	return function (object: unknown, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: {
				validate(repositoryUrl: string) {
					return !!allowedProviders.filter((provider) => repositoryUrl.includes(provider))
						.length;
				},
				defaultMessage(): string {
					return 'RepositoryUrl must be provided by Github';
				},
			},
		});
	};
}
