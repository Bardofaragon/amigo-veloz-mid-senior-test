import { Get, Route, Tags } from 'tsoa';
import { Request, Response } from 'express';

@Route('hello')
@Tags('Hello')
export class HelloController {
	@Get('/')
	public async getMessage(): Promise<{ message: string }> {
		return { message: 'Hello, World!' };
	}
}
