import {
	Post,
	Route,
	Tags,
	Path,
	Request,
	Body,
	Response,
	Security,
	Get,
	Patch,
	Controller,
	Query,
} from 'tsoa';
import { LoanService } from '../services/loan.service.js';
// import { Loan } from '../models/loan.model.js';
import { User } from '../models/user.model.js';
import { LoanApplicationDto } from '../dtos/loan-application.dto.js';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../middlewares/error-handler/index.js';
import { UserRole } from '../models/user.model.js';
import { ValidateBody } from '../decorators/validate-body.decorator.js';
import { UpdateLoanStatusDto } from '../dtos/loan-update.dto.js';
import { Loan } from '../models/loan.model.js';
import { Payment } from '../models/payment.model.js';

@Route('loans')
@Tags('Loans')
export class LoanController extends Controller {
	private loanService = new LoanService();

	/**
	 * Creates a loan
	 *
	 */
	@Post('/')
	@Security('jwt', [UserRole.USER, UserRole.ADMIN])
	@ValidateBody(LoanApplicationDto)
	public async submitLoan(
		@Request() request: Express.Request,
		@Body() loanData: LoanApplicationDto,
	): Promise<any> {
		const user = request.user as User; // USER MUST EXIST IF IT WENT THROUGH THE SECURITY
		const loan = await this.loanService.submitLoanApplication(user, loanData);
		this.setStatus(201);
		return loan;
	}

	/**
	 * Retrieves all loans of the authenticated user
	 */
	@Get('/')
	@Security('jwt', [UserRole.USER, UserRole.ADMIN])
	@Response<UnauthorizedError>(401, 'Unauthorized - User not authenticated')
	public async getUserLoans(
		@Request() request: Express.Request,
		@Query('page') page?: number,
		@Query('pageSize') pageSize?: number,
	): Promise<any[]> {
		const user = request.user as User;
		return this.loanService.getUserLoans(user, page, pageSize);
	}

	/**
	 * Retrieves the details of a specific loan for the authenticated user
	 * @param loanId The ID of the loan to retrieve
	 */
	@Get('{loanId}')
	@Security('jwt', [UserRole.USER, UserRole.ADMIN])
	@Response<NotFoundError>(404, 'Not Found - Loan not found')
	@Response<UnauthorizedError>(401, 'Unauthorized - User not authenticated')
	public async getUserLoanById(
		@Request() request: Express.Request,
		@Path() loanId: number,
	): Promise<any> {
		const user = request.user as User;
		return this.loanService.getLoanById(user, loanId);
	}

	/**
	 * Updates the status of a specific loan
	 * Only admins are allowed to perform this operation
	 * @param loanId The ID of the loan to update
	 */
	@Patch('{loanId}/status')
	@Security('jwt', [UserRole.ADMIN])
	@Response<NotFoundError>(404, 'Not Found - Loan not found')
	@Response<BadRequestError>(400, 'Bad Request - Invalid status value')
	@Response<UnauthorizedError>(
		401,
		'Unauthorized - Only admins can update loan status',
	)
	@ValidateBody(UpdateLoanStatusDto)
	public async updateLoanStatus(
		@Request() request: Express.Request,
		@Path() loanId: number,
		@Body() updateData: UpdateLoanStatusDto,
	): Promise<any> {
		return this.loanService.updateLoanStatus(loanId, updateData); // NO need to validate for admin since the role is defined for admin only in security decorator
	}

	/**
	 * Retrieves all payments for a specific loan
	 * Only the loan owner or an admin can access this data
	 * @param loanId The ID of the loan
	 */
	@Get('/{loanId}/payments')
	@Security('jwt', [UserRole.USER, UserRole.ADMIN])
	@Response<NotFoundError>(404, 'Not Found - Loan not found')
	@Response<UnauthorizedError>(
		403,
		'Forbidden - You cannot access these payments',
	)
	public async getPaymentsByLoanId(
		@Request() request: Express.Request,
		@Path() loanId: number,
	): Promise<any[]> {
		const user = request.user as User;
		return this.loanService.getPaymentsByLoanId(user, loanId);
	}
}
