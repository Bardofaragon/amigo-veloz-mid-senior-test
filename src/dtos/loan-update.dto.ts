import { IsEnum } from 'class-validator';
import { LoanStatus } from '../models/loan.model.js';

export class UpdateLoanStatusDto {
	@IsEnum(LoanStatus, {
		message: `Status must be one of: ${Object.values(LoanStatus).join(', ')}`,
	})
	status!: LoanStatus;
}
