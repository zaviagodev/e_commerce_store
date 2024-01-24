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
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        <div className='lg:col-span-1 flex flex-col w-[150px] mx-auto'>
          <div className='flex flex-col gap-y-4 items-center mx-auto'>
            <img
              className="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none"
              src={user?.user?.user_image ? `${import.meta.env.VITE_ERP_URL || ""}${user.user.user_image}` : "https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/men_category.png"}
              width="80"
              height="80"
              alt="User Image"
            />
            <p className="font-semibold text-sm">{currentUser}</p>
          </div>
          <hr className='border my-4'/>
          <div className='flex flex-col gap-y-4 items-center'>
            {menus.map(menu => (
              <Link to={menu.link} className={`text-sm hover:text-black ${location.pathname === menu.link ? 'font-medium text-black' : 'text-maingray'}`}>{menu.title}</Link>
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