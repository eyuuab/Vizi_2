import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a free SlideForge AI account to start building presentations.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
