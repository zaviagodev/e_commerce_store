import React from 'react'
import { SfBadge } from '@storefront-ui/react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import AddressCard from './AddressCard';

const AddressListing = ({ randomKey = 0 }) => {
    const { data } = useFrappeGetCall('headless_e_commerce.api.get_addresses', null, `addresses-${randomKey}`)

    return (
        <div className="grid grid-cols-1 gap-3">
            {data?.message?.map((address, idx) => (
                <div key={address.idx + idx} className='relative'>
                    <AddressCard
                        title={address.address_title}
                        addressLine1={address.address_line1}
                        addressLine2={address.address_line2}
                        city={address.city}
                        state={address.state === "Select One" ? null : address.state}
                        country={address.country}
                    />
                    {/* <div className='absolute top-0 left-0 flex gap-1 px-1 py-1'>
                        <SfBadge
                            content="Billing"
                            placement='top-left'
                            className='bg-primary-900'
                            style={{
                                position: "unset",
                                fontSize: '1rem',
                                padding: '0.50rem 0.5rem',
                                display: address.is_primary_address ? 'block' : 'none',
                            }}
                        />
                        <SfBadge
                            content="Shipping"
                            placement='top-left'
                            className='bg-primary-900'
                            style={{
                                position: "unset",
                                fontSize: '1rem',
                                padding: '0.50rem 0.5rem',
                                display: address.is_shipping_address ? 'block' : 'none',
                            }}
                        />
                    </div> */}
                </div>
            ))}
        </div >
    )
}

export default AddressListing

