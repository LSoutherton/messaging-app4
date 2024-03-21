import React from 'react'

const SuggestedUser = ({ setUser, username, id }) => {
  return (
    <div key={id} onClick={() => setUser(username)} className='grid grid-cols-6 border-b-2 border-orange-500 cursor-pointer h-16 w-full text-orange-500 flex m-auto bg-gray-200 hover:bg-gray-300 pl-2 pr-2 cursor-pointer'>
      <img className='w-12 rounded-full m-auto border-2 border-orange-500' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' />
      <p className='text-3xl m-auto ml-4'>{username}</p>
    </div>
  )
}

export default SuggestedUser
