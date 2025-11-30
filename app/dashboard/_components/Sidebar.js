"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Layout, Shield, FileText } from "lucide-react";
import Image from "next/image";
import React from "react";
import UploadPdf from "./UploadPdf";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Sidebar() {
  const { user } = useUser();
  const path = usePathname();

  const getUserInfo = useQuery(api.user.getUserInfo, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div className="
      shadow-sm flex flex-col items-center
      h-screen md:w-64 w-full
      bg-white p-6 relative
      md:fixed md:left-0 md:top-0
    ">

      {/* Logo */}
      <div className="flex justify-center cursor-pointer md:mt-[-20px] mt-[-10px] w-full">
        <Link href="/">
        <Image
          src="/logo.png"
          priority
          width={120}
          height={100}
          alt="logo"
        />
          </Link>
      </div>

      {/* Upload Button (placed nicely on mobile) */}
      <div className="w-full mt-4 md:mt-10 flex justify-center md:justify-start">
        <UploadPdf isMaxFile={fileList?.length >= 7 && !getUserInfo?.upgrade}>
          <Button
            variant="outline"
            className="
              border-indigo-500 text-indigo-600 font-semibold
              flex items-center gap-2 w-full
              hover:bg-indigo-50 hover:border-indigo-600
            "
          >
            <FileText size={18} className="text-indigo-600" />
            Upload PDF
          </Button>
        </UploadPdf>
      </div>

      {/* Menu Section */}
      <div className="mt-6 w-full flex flex-col gap-3">
        <Link href="/dashboard">
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-md
              transition-all duration-200 cursor-pointer
              ${path === "/dashboard" ? "bg-indigo-200" : "hover:bg-indigo-100"}
            `}
          >
            <Layout
              size={20}
              className={`${
                path === "/dashboard" ? "text-indigo-600" : "text-indigo-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              Work Space
            </span>
          </div>
        </Link>

        <Link href="/dashboard/upgrade">
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-md
              transition-all duration-200 cursor-pointer
              ${
                path === "/dashboard/upgrade"
                  ? "bg-indigo-200"
                  : "hover:bg-indigo-100"
              }
            `}
          >
            <Shield
              size={20}
              className={`${
                path === "/dashboard/upgrade"
                  ? "text-indigo-700"
                  : "text-indigo-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">Upgrade</span>
          </div>
        </Link>
      </div>

      {/* Progress Bar Section */}
      {!getUserInfo?.upgrade && (
        <div className="absolute bottom-6 w-[90%] text-center">
          <Progress value={(fileList?.length / 7) * 100} />
          <p className="text-xs font-semibold mt-2">
            {fileList?.length ?? 0} out of 7 PDFs uploaded
          </p>
          <p className="text-xs text-gray-500">Upgrade to upload more</p>
        </div>
      )}
    </div>
  );
}

export default Sidebar;



// "use client";

// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Layout, Shield, FileText } from "lucide-react";
// import Image from "next/image";
// import React from "react";
// import UploadPdf from "./UploadPdf";
// import { useUser } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { usePathname } from "next/navigation";
// import Link from "next/link";

// function Sidebar() {
//   const { user } = useUser();
//   const path = usePathname();
//   const getUserInfo = useQuery(api.user.getUserInfo, {
//     userEmail: user?.primaryEmailAddress?.emailAddress,
//   });
//   console.log(getUserInfo);

//   const fileList = useQuery(api.fileStorage.GetUserFiles, {
//     userEmail: user?.primaryEmailAddress?.emailAddress,
//   });

//   return (
//     <div className="shadow-sm flex flex-col items-center h-screen md:w-64 w-34 bg-white p-6 relative">
//       {/* Logo */}
//       <Image
//         src="/logo.png"
//         priority
//         className="mt-[-25px]"
//         width={120}
//         height={100}
//         alt="logo"
//       />

//       {/* Menu Section */}
//       <div className="mt-10 w-full flex flex-col gap-3">
//         <UploadPdf isMaxFile={fileList?.length >= 7 && !getUserInfo.upgrade}>
//           <Button
//             variant="outline"
//             className="border-indigo-500 cursor-pointer text-indigo-600 font-semibold flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-600 transition-all"
//           >
//             <FileText size={18} className="text-indigo-600" /> {/* PDF icon */}+
//             Upload PDF
//           </Button>
//         </UploadPdf>

//         {/* Workspace Button */}
//         <Link href={"/dashboard"}>
//           <div
//             className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer ${
//               path === "/dashboard" ? "bg-indigo-200" : "hover:bg-indigo-100"
//             }`}
//           >
//             <Layout
//               className={`${
//                 path === "/dashboard" ? "text-indigo-600" : "text-indigo-400"
//               } relative top-[1px]`}
//               size={20}
//             />
//             <span className="text-sm font-medium text-gray-700">
//               Work Space
//             </span>
//           </div>
//         </Link>

//         {/* Upgrade Button */}
//         <Link href={"/dashboard/upgrade"}>
//           <div
//             className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer ${
//               path === "/dashboard/upgrade"
//                 ? "bg-indigo-200"
//                 : "hover:bg-indigo-100"
//             }`}
//           >
//             <Shield
//               className={`${
//                 path === "/dashboard/upgrade"
//                   ? "text-indigo-700"
//                   : "text-indigo-400"
//               } relative top-[1px]`}
//               size={20}
//             />
//             <span className="text-sm font-medium text-gray-700">Upgrade</span>
//           </div>
//         </Link>
//       </div>

//       {/* Progress Bar Section */}
//       {
//         !getUserInfo?.upgrade && 
//       <div className="absolute bottom-6 w-[85%]">
//         <Progress value={(fileList?.length / 7) * 100} />
//         <p className="text-xs font-semibold mt-2">
//           {fileList?.length ?? 0} out of 7 PDFs uploaded
//         </p>
//         <p className="text-xs text-gray-500">Upgrade to upload more</p>
//       </div>
//       }     
//     </div>
//   );
// }

// export default Sidebar;