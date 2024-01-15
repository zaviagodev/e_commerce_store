import React, { useState } from 'react'
import ProfileCard from '../components/ProfileCard'
import { useUser } from '../hooks/useUser';
import { useFrappeAuth } from 'frappe-react-sdk';
import { Link, useLocation } from 'react-router-dom'

const MyAccountSection = ({children}) => {
  const { user, logout } = useUser()
  const { currentUser } = useFrappeAuth()
  const location = useLocation()
  const menus = [
    {title:'Account Details', link:'/profile'},
    {title:'My Addresses', link:'/my-addresses'},
    {title:'My Orders', link:'/order-history'},
  ]
  return (
    <main className='main-section'>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12'>
        <div className='lg:col-span-1 flex flex-col gap-y-3 w-[250px] mx-auto'>
          <div className='flex flex-col gap-y-2 items-center mx-auto'>
            <img
              className="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none"
              src="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/men_category.png"
              width="140"
              height="140"
            />
            <p className="font-semibold text-sm">{currentUser}</p>
          </div>
          <div className='flex flex-col gap-y-1 items-center border-t'>
            {menus.map(menu => (
              <Link to={menu.link} className={`px-4 py-2 text-sm hover:text-black ${location.pathname === menu.link ? 'font-medium text-black' : 'text-[#A1A1A1]'}`}>{menu.title}</Link>
            ))}
          </div>
        </div>
        <div className='col-span-2 xl:col-span-3'>
          {children}
        </div>
      </div>
    </main>
  )
}

export default MyAccountSection