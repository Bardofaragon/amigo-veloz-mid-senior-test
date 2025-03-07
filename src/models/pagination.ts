import { Model, FindAndCountOptions } from 'sequelize';

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
}

export async function paginate<T extends Model>(
	model: {
		findAndCountAll: (
			options: FindAndCountOptions,
		) => Promise<{ rows: T[]; count: number }>;
	},
	options: FindAndCountOptions,
	page: number = 1,
	pageSize: number = 10,
): Promise<PaginatedResponse<T>> {
	const offset = (page - 1) * pageSize;

	const { rows: items, count: total } = await model.findAndCountAll({
		...options,
		limit: pageSize,
		offset,
	});

	return { items, total, page, pageSize };
}
