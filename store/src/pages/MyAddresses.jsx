import React, { useState } from 'react'
import AddressForm from '../components/forms/AddressForm'
import AddressListing from '../components/AddressListing'
import MyAccountSection from '../components/MyAccountSection'
import { SfIconAdd } from '@storefront-ui/react'
import { Icons } from '../components/icons'

const MyAddresses = () => {
  const [addNewAddress, setAddNewAddress] = useState(false)
  const [randomKey, setrandomKey] = useState(0)
  const UpdateAddresses = () => {
    setAddNewAddress(false);
    setrandomKey(randomKey + 1);
    setMoreAddresses(true);
}

  return (
    <MyAccountSection>
      <h1 className='font-medium text-baselg text-darkgray mb-10'>ที่อยู่</h1>
      {addNewAddress ? (
        <div className='mb-3'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className="w-full font-medium text-basesm text-secgray">เพิ่มที่อยู่ใหม่</h2>
            <a className='text-[16px] hover:underline cursor-pointer inline-block font-medium' onClick={() => setAddNewAddress(false)}>ยกเลิก</a>
          </div>
          <AddressForm onFormSubmit={() => UpdateAddresses() } />
        </div>
      ) : (
        <div className='border border-lightgray bg-neutral-50 text-darkgray px-4 py-[18px] flex gap-x-[10px] items-center cursor-pointer rounded-xl text-basesm font-bold leading-[10px]' onClick={() => setAddNewAddress(true)}>
          <Icons.plusCircle color='#595959'/>
          เพิ่มที่อยู่ใหม่
        </div>
      )}

      <div className='mt-10'>
        <AddressListing randomKey={randomKey} />
      </div>
    </MyAccountSection>
  )
}

export default MyAddresses