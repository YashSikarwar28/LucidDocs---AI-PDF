// import { SignIn } from "@clerk/nextjs";

// export default function Page() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <SignIn />
//     </div>
//   );
// }



"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
            card: "shadow-lg rounded-xl",
          },
        }}
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
