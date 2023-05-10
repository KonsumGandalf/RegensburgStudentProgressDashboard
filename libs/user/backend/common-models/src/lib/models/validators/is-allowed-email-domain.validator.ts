import { registerDecorator, ValidationOptions } from 'class-validator';

const allowedDomains = ['st.oth-regensburg.de'];

export function IsAllowEmailDomain(validationOptions?: ValidationOptions) {
	return function (object: unknown, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: {
				validate(email: string) {
					return allowedDomains.includes(email.split('@')[1]);
				},
				defaultMessage(): string {
					return 'Email must be provided by OTH Regensburg';
				},
			},
		});
	};
}
