import React, { useState } from 'react'
import ProfileCard from '../components/ProfileCard'
import defaultAvatar from '../assets/default-avatar.svg'
import { useUser } from '../hooks/useUser';
import { useFrappeAuth } from 'frappe-react-sdk';
import { Link, useLocation } from 'react-router-dom'
import { Icons } from './icons';

const MyAccountSection = ({children}) => {
  const { user, logout } = useUser()
  const { currentUser } = useFrappeAuth()
  const location = useLocation()
  const [activeLink, setActiveLink] = useState(location.pathname)
  const accountMenus = [
    {title:'รายละเอียดบัญชี', link:'/profile', icon:<Icons.user01 color={activeLink.includes('/profile') ? '#111111' : '#595959'}/>},
    {title:'ที่อยู่', link:'/my-addresses', icon:<Icons.marketPin04 className='w-5 h-5' color={activeLink.includes('/my-addresses') ? '#111111' : '#595959'}/>},
    {title:'คำสั่งซื้อ', link:'/order-history', icon:<Icons.file06 color={activeLink.includes('/order-history') ? '#111111' : '#595959'}/>},
  ]

  console.log(user)

  return (
    <main className='main-section-my-account'>
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-12'>
        <div className='col-span-1 lg:flex flex-col py-[50px] hidden'>
          <div className='flex flex-col gap-y-4'>
            <img
              className="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none w-[60px] h-[60px] object-cover"
              src={user?.user?.user_image ? `${import.meta.env.VITE_ERP_URL || ""}${user.user.user_image}` : defaultAvatar}
              width="80"
              height="80"
              alt="User Image"
            />
            <p className="font-semibold text-baselg leading-5">{currentUser}</p>
          </div>
          <div className='flex flex-col mt-12'>
            {accountMenus.map(menu => (
              <Link to={menu.link} className={` flex font-bold items-center gap-x-[10px] leading-[10px] h-[50px] hover:text-linkblack ${activeLink.includes(menu.link) ? 'text-linkblack' : 'text-darkgray'}`}>
                {menu.icon}
                {menu.title}
              </Link>
            ))}
          </div>
        </div>
        <div className='lg:col-span-4 w-full mx-auto lg:p-[50px] lg:shadow-checkout lg:h-[calc(100vh_-_57px)] lg:overflow-y-auto'>
          <div className={`w-full ${activeLink.includes('/order-history') ? 'lg:w-[720px]' : 'lg:w-[410px]'} mx-auto`}>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

export default MyAccountSection