import React, { useState } from 'react'
import ProfileCard from '../components/ProfileCard'
import { Link, useLocation } from 'react-router-dom'

const MyAccountSection = ({children}) => {
  const location = useLocation()
  const menus = [
    {title:'My Orders', link:'/order-history'},
    {title:'My Account', link:'/profile'}
  ]
  return (
    <main className='main-section'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-10'>
        <div className='lg:col-span-1'>
          <ProfileCard />
          <div className='flex flex-col gap-y-2 mt-2'>
            {menus.map(menu => (
              <Link to={menu.link} className={`px-4 py-2 rounded-md hover:bg-gray-100 ${location.pathname === menu.link ? 'bg-gray-100' : ''}`}>{menu.title}</Link>
            ))}
          </div>
        </div>
        <div className='lg:col-span-2'>
          {children}
        </div>
      </div>
    </main>
  )
}

export default MyAccountSection