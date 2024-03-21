import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { selectUser } from '../features/userSlice.js';
import { useSelector } from 'react-redux/es/hooks/useSelector';

type Props = {
  user: string,
  message: string,
  time: string,
  date: any,
  id: number,
  newM: boolean,
  large: boolean,
  setUser: any,
  selected: boolean
}

const Conversation: React.FC<Props>  = ({ user, message, time, date, id, newM, large, setUser, selected }) => {

  const current = new Date();
  const currentUser = useSelector(selectUser);

  let display = '';

  if (current.toDateString() != date) {
    display = date
  } else {
    display = time
  }

  let elipsis = false;

  if (message.length > 19) {
    elipsis = true
  }

  const storedValue:string | null = localStorage.getItem(`${user}`);
  let storedNumber:number = 0;

  let newMessage = false;

  if (storedValue) {
    storedNumber = JSON.parse(storedValue)
  }

  if (storedNumber != id && !newM) {
    newMessage = true
  }

  const handleClick = () => {
    localStorage.setItem(`${user}`, JSON.stringify(id));
    setUser(user)
  }
  
  return (
    <>
      {large ? 
      <div onClick={handleClick} key={id} className={`grid grid-cols-7 border-2 rounded-xl ${selected ? 'bg-orange-500 border-white' : 'border-orange-500'} cursor-pointer mt-1 p-1 pb-2`}>
        <div className='col-span-4 pt-1 ml-4'>
          <h1 className={`text-2xl ${selected ? 'text-white' : 'text-orange-500'} font-semibold`}>{user}</h1>
          <h2 className={`${newMessage ? 'font-bold text-black' : ''}text-base ${selected ? 'text-white' : 'text-gray-500'}`}>{message.slice(0, 19)}{elipsis ? '...' : ''}</h2>
        </div>
        <div className={`col-span-3 text-sm ${selected ? 'text-white' : 'text-gray-500'} flex m-auto mr-2`}>
          {display}
          {newMessage ? <div className='bg-green-500 w-4 h-4 rounded-full mt-0.5 ml-2'><div className='bg-green-500 w-4 h-4 animate-ping rounded-full'></div></div> : ''}
        </div>
      </div>
      :
        <Link key={id} to='/messaging/:id' state={{user}} className='grid grid-cols-7 border-2 rounded-xl border-orange-500 cursor-pointer mt-1 p-1 pb-2'>
          <div className='col-span-4 pt-1 ml-4'>
            <h1 className='text-2xl text-orange-500 font-semibold'>{user}</h1>
            <h2 className={`${newMessage ? 'font-bold text-black' : ''}text-base text-gray-500`}>{message.slice(0, 19)}{elipsis ? '...' : ''}</h2>
          </div>
          <div className='col-span-3 text-sm text-gray-500 flex m-auto mr-2'>
            {display}
            {newMessage ? <div className='bg-green-500 w-4 h-4 rounded-full mt-0.5 ml-2'><div className='bg-green-500 w-4 h-4 animate-ping rounded-full'></div></div> : ''}
          </div>
        </Link>}
    </>
  )
}

export default React.memo(Conversation);
