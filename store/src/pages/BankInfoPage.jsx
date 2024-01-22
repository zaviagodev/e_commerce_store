import { SfButton } from '@storefront-ui/react';
import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import defaultLogo from '../assets/defaultBrandIcon.svg';
import { useSetting } from '../hooks/useWebsiteSettings';

const BankInfoPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { appLogo } = useSetting()

    const data = [
      { title:'Order ID', info:searchParams.get("order_id")},
      { title:'Date', info:''},
      { title:'Total', info:`฿${searchParams.get("amount")}`}
    ]

    console.log(appLogo)

    return (
        <div className='pt-10 w-full'>
            <div className='max-w-[549px] mx-auto flex flex-col gap-y-9 p-8 border border-neutral-50 rounded-[30px]'>
                <div className='flex justify-center'>
                    <picture>
                    <source srcSet={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo} media="(min-width: 768px)" />
                    <img
                        src={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo}
                        alt="Sf Logo"
                        // className='max-h-8'
                    />
                    </picture>
                </div>
                <div className='flex flex-col gap-y-[26px] py-4'>
                    <h1 className='text-lg text-center font-medium'>ใบเสร็จ บริษัท ซาเวียโก</h1>
                    <div className='flex flex-col gap-y-[14px]'>
                        {data.map(d => (
                            <div className='flex items-center justify-center gap-x-1'>
                                <h2 className='text-sm font-medium'>{d.title}: </h2>
                                <p className='text-sm'>{d.info}</p>
                            </div>
                        ))}
                    </div>
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