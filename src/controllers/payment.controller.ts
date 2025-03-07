import {
	Post,
	Route,
	Tags,
	Request,
	Body,
	Response,
	Security,
	Controller,
} from 'tsoa';
import { PaymentService } from '../services/payment.service.js';
import { User } from '../models/user.model.js';
import { CreatePaymentDto } from '../dtos/create-payment.dto.js';
import {
	NotFoundError,
	UnauthorizedError,
	BadRequestError,
} from '../middlewares/error-handler/index.js';
import { UserRole } from '../models/user.model.js';
import { ValidateBody } from '../decorators/validate-body.decorator.js';

@Route('payments')
@Tags('Payments')
export class PaymentController extends Controller {
	private paymentService = new PaymentService();

	/**
	 * Creates a new payment for a specific loan
	 * Only the loan owner or an admin can create a payment
	 * @param paymentData The payment details including the loan ID
	 */
	@Post('/')
	@Security('jwt', [UserRole.USER, UserRole.ADMIN])
	@Response<NotFoundError>(404, 'Not Found - Loan not found')
	@Response<BadRequestError>(400, 'Bad Request - Invalid payment data')
	@ValidateBody(CreatePaymentDto)
	public async createPayment(
		@Request() request: Express.Request,
		@Body() paymentData: CreatePaymentDto,
	): Promise<any> {
		const user = request.user as User;
		const payment = await this.paymentService.createPayment(user, paymentData);
		this.setStatus(201);
		return payment;
	}
}
