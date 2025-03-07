import { Payment } from '../models/payment.model.js';
import { User } from '../models/user.model.js';
import { CreatePaymentDto } from '../dtos/create-payment.dto.js';
import {
	BadRequestError,
	ConflictError,
} from '../middlewares/error-handler/index.js';
import { LoanService } from './loan.service.js';
import { LoanStatus } from '../models/loan.model.js';

export class PaymentService {
	private loanService = new LoanService();
	/**
	 * Creates a new payment for a specific loan
	 * @param user The authenticated user
	 * @param paymentData The payment data including the loan ID
	 * @returns The created payment
	 */
	public async createPayment(
		user: User,
		paymentData: CreatePaymentDto,
	): Promise<Payment> {
		const { loanId, amount_paid, payment_date } = paymentData;

		const loan = await this.loanService.getLoanById(user, loanId); // No need to further validate if loan exists because that's handled by the loan service
		if (loan.status !== LoanStatus.Approved) {
			throw new ConflictError('You can only pay approved loans');
		}

		if (amount_paid > loan.remaining_balance) {
			throw new BadRequestError('You cannot pay more than you owe');
		}
		const payment = await Payment.create({
			loan_id: loanId,
			amount_paid,
			payment_date: payment_date ? new Date(payment_date) : new Date(),
		});

		return payment;
	}
}
