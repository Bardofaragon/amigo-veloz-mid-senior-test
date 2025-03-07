export class ApiError extends Error {
	constructor(
		public statusCode: number,
		message: string,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message = 'Unauthorized') {
		super(401, message);
	}
}

export class ForbiddenError extends ApiError {
	constructor(message = 'Forbidden') {
		super(403, message);
	}
}

export class NotFoundError extends ApiError {
	constructor(message = 'Not Found') {
		super(404, message);
	}
}

export class ConflictError extends ApiError {
	constructor(message = 'Conflict') {
		super(409, message);
	}
}
export class BadRequestError extends ApiError {
	constructor(message = 'Bad Request') {
		super(400, message);
	}
}
