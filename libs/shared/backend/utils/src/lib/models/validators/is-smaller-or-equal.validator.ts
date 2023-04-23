import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

/**
 * Decorator that checks if a property is smaller than or equal to another property's value.
 * @param property - The name of the property to compare the decorated property to.
 * @param validationOptions - Additional validation options.
 * @returns A decorator function that registers the 'isSmallerOrEqual' validator with the class's metadata.
 */
export function IsSmallerOrEqualValidator(
    property: string,
    validationOptions?: ValidationOptions
) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isSmallerOrEqual',
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
                        value <= relatedValue
                    );
                },
            },
        });
    };
}
