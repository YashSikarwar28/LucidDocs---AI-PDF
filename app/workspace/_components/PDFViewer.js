import React from 'react'

function PDFViewer({fileUrl}) {
    console.log(fileUrl);
    
  return (
    <div>
      <iframe src={fileUrl} height="90vh" width="100%" className='h-[90vh]'/>
    </div>
  )
}

export default PDFViewer
