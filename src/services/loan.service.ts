import { Loan } from '../models/loan.model.js';
import { User, UserRole } from '../models/user.model.js';
import { Payment } from '../models/payment.model.js';
import { LoanApplicationDto } from '../dtos/loan-application.dto.js';
import { NotFoundError } from '../middlewares/error-handler/api-errors.js';
import { UpdateLoanStatusDto } from '../dtos/loan-update.dto.js';
import { fn } from 'sequelize';
import { col } from 'sequelize';
import { literal } from 'sequelize';
export interface LoanResponse {
	id: number;
	user_id: number;
	amount: number;
	purpose: string;
	duration: number;
	status: string;
	total_paid: number;
	remaining_balance: number;
	created_at: Date;
}

export class LoanService {
	/**
	 * Submits a loan application for the authenticated user
	 * @param user - The authenticated user
	 * @param loanData - The loan application data
	 * @returns The created loan with calculated fields
	 */
	public async submitLoanApplication(
		user: User,
		loanData: LoanApplicationDto,
	): Promise<Loan> {
		const loan = await Loan.create({
			user_id: user.id,
			amount: loanData.amount,
			purpose: loanData.purpose,
			duration: loanData.duration,
			status: 'Pending',
		});

		return await loan.reload({ include: [Payment] });
	}

	/**
	 * Gets all loans for the authenticated user with calculated fields
	 * @param user The authenticated user
	 * @returns A list of loans with calculated fields
	 */
	public async getUserLoans(user: User): Promise<Loan[]> {
		return await Loan.findAll({
			where: { user_id: user.id },
			attributes: {
				include: [
					[
						fn('COALESCE', fn('SUM', col('payments.amount_paid')), 0),
						'total_paid',
					],
					[
						literal(
							`"Loan"."amount" - COALESCE(SUM("payments"."amount_paid"), 0)`,
						),
						'remaining_balance',
					],
				],
			},
			include: [
				{
					model: Payment,
					as: 'payments',
					attributes: [],
				},
			],
			group: ['Loan.id'],
		});
	}

	/**
	 * Gets the details of a specific loan
	 * @param user The authenticated user
	 * @param loanId The ID of the loan to retrieve
	 * @returns The loan details with calculated fields
	 */
	public async getLoanById(user: User, loanId: number): Promise<LoanResponse> {
		const loanObj = await Loan.findOne({
			where:
				user.role === UserRole.ADMIN
					? { id: loanId }
					: { id: loanId, user_id: user.id },
			attributes: {
				include: [
					[
						fn('COALESCE', fn('SUM', col('payments.amount_paid')), 0),
						'total_paid',
					],
					[
						literal(
							`"Loan"."amount" - COALESCE(SUM("payments"."amount_paid"), 0)`,
						),
						'remaining_balance',
					],
				],
			},
			include: [
				{
					model: Payment,
					as: 'payments',
					attributes: [],
				},
			],
			group: ['Loan.id'],
		});

		if (!loanObj) {
			throw new NotFoundError('Loan not found');
		}

		const loan = loanObj.get({ plain: true });

		if (user.role !== UserRole.ADMIN && loan.user_id !== user.id) {
			throw new NotFoundError('Loan not found');
		}

		return loan;
	}

	/**
	 * Updates the status of a specific loan
	 * @param loanId The ID of the loan to update
	 * @param updateData The data containing the new status
	 * @returns The updated loan
	 */
	public async updateLoanStatus(
		loanId: number,
		updateData: UpdateLoanStatusDto,
	): Promise<Loan> {
		const loan = await Loan.findByPk(loanId);

		if (!loan) {
			throw new NotFoundError('Loan not found');
		}
		await loan.update({ status: updateData.status });

		return loan;
	}

	/**
	 * Retrieves all payments for a specific loan
	 * Only the loan owner or an admin can access this data
	 * @param user The authenticated user
	 * @param loanId The ID of the loan
	 * @returns A list of payments for the loan
	 */
	public async getPaymentsByLoanId(
		user: User,
		loanId: number,
	): Promise<Payment[]> {
		// Fetch only the necessary fields (id and user_id)
		const loanObj = await Loan.findOne({
			where: { id: loanId },
			attributes: ['id', 'user_id'],
		});
		if (!loanObj) {
			throw new NotFoundError('Loan not found');
		}

		const loan = loanObj.get({ plain: true });

		if (user.role !== UserRole.ADMIN && loan.user_id !== user.id) {
			throw new NotFoundError('Loan not found');
		}

		return Payment.findAll({ where: { loan_id: loanId } });
	}
}
