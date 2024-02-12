// List of payment methods
import qrmock from '../assets/qrmock.png'
import { useState} from 'react';
import { Skeleton } from './Skeleton';
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';
import { Icons } from './icons';

export default function PaymentMethods({
    onChange,
    value,
    error
}) {
    const [randomKey, setrandomKey] = useState(0)
    const { data:paymentmethods, isLoading } = useFrappeGetCall('webshop.webshop.api.payment_info', null, `payments-${randomKey}`)

    return (
        <>
            {!isLoading ? (
                <fieldset className="w-full">
                    <legend className="mb-2 font-semibold text-secgray">วิธีการชำระเงิน <span className='text-red-500'>*</span></legend>
                    <div className={`grid grid-cols-1 ${paymentmethods.message?.length == 2 ? 'md:grid-cols-2' : ''} gap-4 items-stretch`}>
                        {paymentmethods.message?.length > 0 ? paymentmethods.message.map(({name,key }) => (
                            <label key={name} className="relative" onClick={() => onChange(key)}>
                                <div className={`flex ${paymentmethods?.length > 1 ? 'flex-col gap-y-2' : 'items-center gap-x-2'} px-4 py-3 cursor-pointer rounded-xl border border-lightgray -outline-offset-2 hover:border-lightgray hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 bg-neutral-50 ${value == key ? "border-primary-300 outline outline-[1px]" : ""}`}>
                                    {/* <img src={logo} alt={label} className="h-5 w-5 select-none object-cover rounded-[2px]" /> */}
                                    <p className={`text-darkgray  font-bold text-center`}>{name}</p>
                                </div>
                            </label>
                        )) : (
                            <div className='rounded-xl border border-lightgray px-6 py-[18px] bg-neutral-50 flex items-center gap-x-2'>
                                <Icons.wallet04 color='#595959'/>
                                <p className={`text-secgray font-semibold text-sm`}>ไม่มีช่องทางการชำระเงิน กรุณาติดต่อร้านค้าโดยตรง</p>
                            </div>
                        )}
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </fieldset>
            ) : (
                <div className='flex flex-col gap-y-2'>
                    <Skeleton className='h-5 w-[100px]'/>
                    <div className='flex gap-x-4'>
                        <Skeleton className='h-[58px] w-full'/>
                        <Skeleton className='h-[58px] w-full'/>
                    </div>
                </div>
            )}
        </>
    );
}