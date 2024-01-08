import { SfButton } from '@storefront-ui/react';
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom';
const BankInfoPage = () => {
    const [searchParams] = useSearchParams();

    console.log(searchParams)

    const data = [
      { title:'Order ID', info:searchParams.get("order_id")},
      { title:'Date', info:''},
      { title:'Total', info:`฿${searchParams.get("amount")}`}
    ]

    return (
        <div className='p-12 w-full bg-primary-100'>
            <div className='max-w-3xl mx-auto flex flex-col gap-y-8'>
                <h1 className='text-3xl text-center font-medium'>Thank you for your order</h1>
                <p className='text-center'>You have completely made a payment, we will confirm your payment within 6 hours and will send the payment details onto your email.</p>
                {/* <h3 className='text-xl'>Please transfer money to the following bank account:</h3>
                <h5 className='text-xl'>Bank: SCB</h5>
                <h5 className='text-xl'>Account Number: 123456789</h5>
                <h5 className='text-xl'>Account Name: John Doe</h5>
                <h5 className='text-xl'>Amount: ฿ {searchParams.get("amount")}</h5> */}
                <div className='flex flex-col gap-y-1'>
                    {data.map(d => (
                        <div className='flex items-center justify-between'>
                            <h2 className='text-sm font-medium'>{d.title}</h2>
                            <p className='text-sm'>{d.info}</p>
                        </div>
                    ))}
                </div>
                <Link to='/order-history'>
                    <SfButton variant='tertiary' className='w-full btn-primary'>
                        Go to My orders
                    </SfButton>
                </Link>
            </div>
        </div>
    )
}

export default BankInfoPage