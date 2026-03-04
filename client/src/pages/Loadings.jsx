import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {

  const navigate = useNavigate()
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/')
    }, 8000)
    return ()=>clearTimeout(timeout);
  }, [navigate])
  
 

  return (
    <div className='bg-linear-to-b from-[#531B81] to-[#29184B] flex items-center justify-center h-screen w-screen text-white text-2xl'>
      
      <div className='w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin'>
      </div>

    </div>
  )
}

export default Loading
