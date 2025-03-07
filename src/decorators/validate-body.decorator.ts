import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { BadRequestError } from '../middlewares/error-handler/index.js';

/**
 * Custom decorator to validate the request body with class-validator
 * @param dtoClass The DTO class to validate against
 */
export function ValidateBody(dtoClass: any) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const request = args.find((arg) => arg?.body);
			if (!request) {
				throw new BadRequestError('Request body is missing.');
			}

			const dtoInstance = plainToInstance(dtoClass, request.body);
			const errors: ValidationError[] = await validate(dtoInstance);

			if (errors.length > 0) {
				const errorMessages = errors.map((error) => ({
					property: error.property,
					constraints: error.constraints,
				}));
				console.warn('Validation Errors:', errorMessages);
				throw new BadRequestError(
					'Validation failed: ' + JSON.stringify(errorMessages),
				);
			}

			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
}
