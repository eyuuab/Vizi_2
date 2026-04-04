import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-xl',
          },
        }}
        forceRedirectUrl="/dashboard"
        signInUrl="/login"
      />
    </div>
  );
}
