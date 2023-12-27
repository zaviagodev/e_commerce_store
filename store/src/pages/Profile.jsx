import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import ProfileCard from '../components/ProfileCard'
import AddressListing from '../components/AddressListing'
import OrderHistory from '../components/OrderHistory'

const Profile = () => {
    const [randomKey, setrandomKey] = useState(0)
    return (
        <div className='grid lg:grid-cols-2 lg:grid-rows-2 grid-rows-4 grid-cols-1  place-items-center grid-flow-dense'>
            <ProfileCard />
            <OrderHistory className="sm:block hidden"/>
            <AddressForm onSuccess={() => setrandomKey(randomKey + 1)} />
            <AddressListing randomKey={randomKey} />
        </div>
    )
}

export default Profile