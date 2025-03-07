import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany,
	TableOptions,
	Default,
} from 'sequelize-typescript';
import { User } from './user.model.js';
import { Payment } from './payment.model.js';
export enum LoanStatus {
	Pending = 'Pending',
	Approved = 'Approved',
	Rejected = 'Rejected',
}

export interface LoanCreationAttributes {
	user_id: number;
	amount: number;
	purpose: string;
	duration: number;
	status?: 'Pending' | 'Approved' | 'Rejected';
}

@Table({
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: false,
} as TableOptions)
export class Loan extends Model<Loan, LoanCreationAttributes> {
	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	user_id!: number;

	@BelongsTo(() => User)
	user!: User;

	@Column({
		type: DataType.FLOAT,
		allowNull: false,
	})
	amount!: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	purpose!: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	duration!: number;

	@Default(LoanStatus.Pending)
	@Column({
		type: DataType.ENUM(...Object.values(LoanStatus)),
		allowNull: false,
	})
	status!: LoanStatus;

	@HasMany(() => Payment, 'loan_id')
	payments!: Payment[];

	// get total_paid(): number {
	// 	return (
	// 		this.payments?.reduce((sum, payment) => sum + payment.amount_paid, 0) || 0
	// 	);
	// }

	// get remaining_balance(): number {
	// 	return this.amount - this.total_paid;
	// }
}
