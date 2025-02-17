import { z } from 'zod';
import { userSchema } from './user.model';

export const userCondDTOSchema = userSchema
	.pick({
		firstName: true,
		lastName: true,
		username: true,
		role: true,
		status: true,
	})
	.partial();

export type UserCondDTO = z.infer<typeof userCondDTOSchema>;
