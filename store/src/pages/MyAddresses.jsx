import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import AddressListing from '../components/AddressListing'
import MyAccountSection from '../components/MyAccountSection'
import { SfIconAdd } from '@storefront-ui/react'

const MyAddresses = () => {
  const [addNewAddress, setAddNewAddress] = useState(false)
  const [randomKey, setrandomKey] = useState(0)

  return (
    <MyAccountSection>
      <h1 className='mb-10 primary-heading text-center text-primary'>My Addresses</h1>
      <section className='w-3/4 mx-auto'>
        {addNewAddress ? (
          <div className='border p-3 rounded-lg mb-3'>
            <div className='flex items-center justify-between mb-3'>
              <h2 className="font-bold text-neutral-900 text-base">New address</h2>
              <a className='text-sm hover:underline cursor-pointer inline-block font-medium' onClick={() => setAddNewAddress(false)}>Cancel</a>
            </div>
            <AddressForm onSuccess={() => setrandomKey(randomKey + 1)} />
          </div>
        ) : (
          <div className='border p-3 flex gap-x-2 items-center cursor-pointer rounded-lg mb-3 text-sm font-medium' onClick={() => setAddNewAddress(true)}>
            <SfIconAdd />
            <p>Add a New Address</p>
          </div>
        )}

        <AddressListing randomKey={randomKey} />
      </section>
    </MyAccountSection>
  )
}

export default MyAddresses