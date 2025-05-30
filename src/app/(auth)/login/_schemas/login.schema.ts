import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export type LoginPayload = Yup.InferType<typeof loginSchema>;
