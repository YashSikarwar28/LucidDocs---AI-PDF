// import { SignUp } from '@clerk/nextjs'

// export default function Page() {
//   return <SignUp />
// }


"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
            card: "shadow-lg rounded-xl",
          },
        }}
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}
