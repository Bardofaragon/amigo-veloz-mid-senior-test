import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	TableOptions,
} from 'sequelize-typescript';
import { Loan } from './loan.model.js';

@Table({
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: false,
} as TableOptions)
export class Payment extends Model {
	@ForeignKey(() => Loan)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	loan_id!: number;

	@BelongsTo(() => Loan)
	loan!: Loan;

	@Column({
		type: DataType.FLOAT,
		allowNull: false,
	})
	amount_paid!: number;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	payment_date!: Date;
}
