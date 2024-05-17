import React from 'react'
import { useNavigate } from 'react-router-dom'

function Error() {

    const navigate = useNavigate();

  return (
    <div className='w-full h-screen flex items-center justify-center flex-col gap-4'>
      <h1 className='text-4xl font-black text-zinc-300 lg:text-7xl'>404</h1>
      <h1 className=' text-sm text-sm lg:text-xl'>Page not found</h1>
      <button type="button" className="text-white bg-black hover:bg-zinc-700 focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-4 py-2 text-center hover:scale-[1.02] transition-all" onClick={() => navigate('/')}>Back to home</button>
    </div>
  )
}

export default Error
