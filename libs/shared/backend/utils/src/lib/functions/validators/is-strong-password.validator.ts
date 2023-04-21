import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStrongPassword(
    minChars: number,
    requireUpperCase: boolean,
    requireNumber: boolean,
    validationOptions?: ValidationOptions
): PropertyDecorator {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isStrongPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    const passwordRegex = new RegExp(
                        `^(?=.*[${
                            requireUpperCase ? 'A-Z' : ''
                        }])(?=.*\\d).{${minChars},}$`
                    );
                    return passwordRegex.test(value);
                },
                defaultMessage() {
                    const minCharsMsg = `must contain at least ${minChars} characters`;
                    const upperCaseMsg = requireUpperCase
                        ? `at least one uppercase letter`
                        : '';
                    const numberMsg = requireNumber
                        ? `at least one number`
                        : '';
                    const errorMsg = [minCharsMsg, upperCaseMsg, numberMsg]
                        .filter(Boolean)
                        .join(', ');
                    return `Password ${errorMsg}`;
                },
            },
        });
    };
}
