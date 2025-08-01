import React, { useContext, useState } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import { ChatContext } from '../../context/chatContext'

const HomePage = () => {
  const {selectedUser}= useContext(ChatContext)

  return (
    <div className='border h-screen sm:px-[8%] sm:py-[3%]'>
      <div  className={`backdrop-blur-xl  border-2 border-gray-600 
      rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 
        'md:grid-cols-[1fr_1.5fr_1fr] xl:gridcols-[1fr_2fr_1fr]': 'md:grid-cols-2' }`}>
        <SideBar/>
        <ChatContainer/>
        <RightSideBar/>
      </div>
    </div>
  )
}

export default HomePage
