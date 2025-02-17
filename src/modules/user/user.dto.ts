import { z } from 'zod';
import { userSchema } from './user.model';

export const userRegistrationDTOSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    username: true,
    password: true,
  })
  .required();

export const userLoginDTOSchema = userSchema
  .pick({
    username: true,
    password: true,
  })
  .required();

export type UserRegistrationDTO = z.infer<typeof userRegistrationDTOSchema>;
export type UserLoginDTO = z.infer<typeof userLoginDTOSchema>;

export const userUpdateDTOSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    password: true,
    role: true,
    status: true,
  })
  .partial();

export const userCondDTOSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    username: true,
    role: true,
    status: true,
  })
  .partial();

export const userUpdateProfileDTOSchema = userUpdateDTOSchema
  .omit({
    role: true,
    status: true,
  })
  .partial();

export type UserUpdateDTO = z.infer<typeof userUpdateDTOSchema>;
export type UserCondDTO = z.infer<typeof userCondDTOSchema>;
export type UserUpdateProfileDTO = z.infer<typeof userUpdateProfileDTOSchema>;
