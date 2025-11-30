// "use client"

// import { api } from '@/convex/_generated/api';
// import { useUser } from '@clerk/nextjs';
// import { useQuery } from 'convex/react';
// import Image from 'next/image';
// import Link from 'next/link';
// import React from 'react';

// function Dashboard() {
//   const { user } = useUser();

//   const fileList = useQuery(api.fileStorage.GetUserFiles, {
//     userEmail: user?.primaryEmailAddress?.emailAddress,
//   });

//   console.log(fileList);

//   return (
//     <div>
//       <h2 className='font-bold text-3xl text-center mb-6'>WorkSpace</h2>
//       <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
//         {fileList?.length > 0 ? (
//           fileList.map((file, index) => (
//             <Link key={index} href={'/workspace/'+file.fileId} target="_blank">
//             <div
//               key={index}
//               className='flex p-5 shadow-md cursor-pointer flex-col items-center justify-center border hover:scale-105 transition-all'
//               >
//               <Image src={'/file.png'} alt="file" width={70} height={70} />
//               <h2 className='font-semibold text-center mt-2'>{file?.fileName}</h2>
//             </div>
//               </Link>
//           ))
//         ) : (
//           [1, 2, 3, 4, 5, 6, 7].map((_, index) => (
//             <div key={index} className='bg-slate-200 rounded-md h-[150px] animate-pulse'></div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;




"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Dashboard() {
  const { user } = useUser();

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <h2 className="font-bold text-2xl sm:text-3xl text-center mb-6 text-gray-800">
        WorkSpace
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {fileList && fileList.length > 0 ? (
          fileList.map((file) => (
            <Link
              key={file.fileId}
              href={`/workspace/${file.fileId}`}
              target="_blank"
              className="group rounded-lg border bg-white shadow-sm hover:shadow-md transform hover:scale-105 transition-all p-3 sm:p-5 min-h-[120px] flex flex-col items-center justify-center text-center"
            >
              <Image
                src="/file.png"
                alt="file"
                width={70}
                height={70}
                className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
              />

              <h3 className="mt-3 font-semibold text-sm sm:text-base w-full px-2 truncate">
                {file?.fileName}
              </h3>
            </Link>
          ))
        ) : (
          Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="bg-slate-200 rounded-md h-[120px] sm:h-[140px] animate-pulse"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;