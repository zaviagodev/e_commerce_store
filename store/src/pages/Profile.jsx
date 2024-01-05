import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import ProfileCard from '../components/ProfileCard'
import AddressListing from '../components/AddressListing'
import OrderHistory from '../components/OrderHistory'
import { Link } from 'react-router-dom'

const Profile = () => {
    const [randomKey, setrandomKey] = useState(0)
    const menus = [
      {title:'My Orders', link:'/order-history'},
      {title:'My Account', link:'/profile'}
    ]
    return (
      <main className='main-section'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-10'>
          <div className='lg:col-span-1'>
            <ProfileCard />
            {/* <div className='flex flex-col gap-y-2'>
              {menus.map(menu => (
                <Link to={menu.link} className={`px-4 py-2 rounded-md hover:bg-gray-100`}>{menu.title}</Link>
              ))}
            </div> */}
            <OrderHistory className="sm:block hidden"/>
          </div>
          <div className='lg:col-span-2'>
            <AddressForm onSuccess={() => setrandomKey(randomKey + 1)} />
            <AddressListing randomKey={randomKey} />
          </div>
        </div>
      </main>
    )
}

export default Profile