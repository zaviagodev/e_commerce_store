import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import ProfileCard from '../components/ProfileCard'
import AddressListing from '../components/AddressListing'
import OrderHistory from '../components/OrderHistory'

const Profile = () => {
    const [randomKey, setrandomKey] = useState(0)
    return (
        <main className='main-section'>
          <div className='flex gap-x-10'>
            <div className='w-1/3'>
              <ProfileCard />
              <OrderHistory className="sm:block hidden"/>
            </div>
            <div className='w-2/3'>
              <AddressForm onSuccess={() => setrandomKey(randomKey + 1)} />
              <AddressListing randomKey={randomKey} />
            </div>
          </div>
        </main>
    )
}

export default Profile