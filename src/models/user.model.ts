import {
	Table,
	Column,
	Model,
	DataType,
	HasMany,
	Unique,
	TableOptions,
	Default,
} from 'sequelize-typescript';
import { Loan } from './loan.model.js';

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
	GUEST = 'guest',
}
interface UserAttributes {
	id: number;
	name: string;
	email: string;
	password: string;
	role: UserRole;
	created_at?: Date;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

@Table({
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: false,
} as TableOptions)
export class User extends Model<User, UserCreationAttributes> {
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name!: string;

	@Unique
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	email!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	password!: string;

	@HasMany(() => Loan)
	loans!: Loan[];

	@Default(UserRole.USER) // Default role is 'user'
	@Column({
		type: DataType.ENUM(...Object.values(UserRole)),
		allowNull: false,
	})
	role!: UserRole;
}
