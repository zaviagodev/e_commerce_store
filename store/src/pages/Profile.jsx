import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import ProfileCard from '../components/ProfileCard'
import AddressListing from '../components/AddressListing'
import OrderHistory from '../components/OrderHistory'

const Profile = () => {
    const [randomKey, setrandomKey] = useState(0)
    return (
        <div className='grid grid-cols-2 grid-rows-2 place place-items-center grid-flow-dense'>
            <ProfileCard />
            <OrderHistory/>
            <AddressForm onSuccess={() => setrandomKey(randomKey + 1)} />
            <AddressListing randomKey={randomKey} />
        </div>
    )
}

export default Profile