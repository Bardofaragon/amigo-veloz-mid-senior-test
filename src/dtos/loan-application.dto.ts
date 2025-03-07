import { IsNumber, IsString, IsNotEmpty, Min, IsInt } from 'class-validator';

export class LoanApplicationDto {
	@IsNumber({}, { message: 'Amount must be a number' })
	@Min(1, { message: 'Amount must be a positive number' })
	amount!: number;

	@IsString()
	@IsNotEmpty({ message: 'Purpose is required' })
	purpose!: string;

	@IsInt()
	@Min(1, { message: 'Duration must be at least 1 month' })
	duration!: number;
}
