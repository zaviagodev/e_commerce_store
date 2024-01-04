import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import ProfileCard from '../components/ProfileCard'
import AddressListing from '../components/AddressListing'
import OrderHistory from '../components/OrderHistory'

const Profile = () => {
    const [randomKey, setrandomKey] = useState(0)
    return (
        <main className='main-section'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-10'>
            <div className='lg:col-span-1'>
              <ProfileCard />
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