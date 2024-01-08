import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import AddressListing from '../components/AddressListing'
import MyAccountSection from '../components/MyAccountSection'

const Profile = () => {
    const [randomKey, setrandomKey] = useState(0)
    return (
      <MyAccountSection>
        <AddressForm onSuccess={() => setrandomKey(randomKey + 1)} />
        <AddressListing randomKey={randomKey} />
      </MyAccountSection>
    )
}

export default Profile