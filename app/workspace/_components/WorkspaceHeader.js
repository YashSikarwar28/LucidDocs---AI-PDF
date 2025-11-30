import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader({fileName}) {
  return (
    <div className="flex items-center justify-between px-3 h-12 shadow-sm">
      <div className="flex items-center h-full">
        <Image src="/logo.png" alt="logo" width={120} height={24} />
      </div>
        <h2 className='font-bold'>{fileName}</h2>
      <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
      {/* <div className='flex gap-4 item-center'>
        <Button className="cursor-pointer" variant={"outline"}>Save</Button>
      </div> */}
    </div>
  )
}

export default WorkspaceHeader
