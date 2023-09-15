import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import ProfileCard from '../components/ProfileCard'
import AddressListing from '../components/AddressListing'

const Profile = () => {
    const [randomKey, setrandomKey] = useState(0)
    return (
        <div className='p-4'>
            <ProfileCard />
            <AddressListing randomKey={randomKey} />
            <AddressForm onSuccess={() => setrandomKey(randomKey + 1)} />
        </div>
    )
}

export default Profile