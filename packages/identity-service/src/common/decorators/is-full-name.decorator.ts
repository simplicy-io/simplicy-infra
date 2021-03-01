import { registerDecorator, ValidationOptions } from 'class-validator';

export const IS_FULL_NAME = 'isFullName';
export function IsFullName(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: IS_FULL_NAME,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return /^[ A-Za-z]+$/.test(value);
        },
      },
    });
  };
}
