import { IsNumber, IsDateString, Min, IsOptional } from 'class-validator';

export class CreatePaymentDto {
	@IsNumber({}, { message: 'Loan ID must be a number' })
	@Min(1, { message: 'Loan ID must be a positive integer' })
	loanId!: number;

	@IsNumber({}, { message: 'Amount paid must be a number' })
	@Min(1, { message: 'Amount paid must be a positive number' })
	amount_paid!: number;

	@IsOptional()
	@IsDateString({}, { message: 'Payment date must be a valid date string' })
	payment_date?: string;
}
