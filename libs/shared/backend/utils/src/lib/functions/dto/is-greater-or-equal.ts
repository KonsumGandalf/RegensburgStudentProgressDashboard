import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function IsGreaterOrEqual(
    property: string,
    validationOptions?: ValidationOptions
) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isGreaterOrEqual',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[
                        relatedPropertyName
                    ];
                    return (
                        typeof value === 'number' &&
                        typeof relatedValue === 'number' &&
                        value >= relatedValue
                    );
                },
            },
        });
    };
}
