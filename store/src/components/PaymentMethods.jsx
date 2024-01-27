// List of payment methods
import qrmock from '../assets/qrmock.png'
import { useState} from 'react';
import { Skeleton } from './Skeleton';
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';

const paymentMethods = [
    {
        label: 'QR พร้อมเพย์',
        value: 'QR พร้อมเพย์',
        logo: qrmock,
    },
    {
        label: 'บัตรเครดิต / เดบิต',
        value: 'บัตรเครดิต / เดบิต',
        logo: qrmock,
    }
];

export default function PaymentMethods({
    onChange,
    value,
    error
}) {
    const [randomKey, setrandomKey] = useState(0)
    const { data:paymentmethods } = useFrappeGetCall('webshop.webshop.api.payment_info', null, `payments-${randomKey}`)

    console.log(paymentmethods);

    return (
        <>
            {paymentmethods ? (
                <fieldset className="w-full">
                    <legend className="mb-2 font-semibold text-secgray">วิธีการชำระเงิน</legend>
                    <div className={`grid ${paymentmethods?.length == 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 items-stretch`}>
                        {paymentmethods.message.map(({name,key }) => (
                            <label key={name} className="relative" onClick={() => onChange(key)}>
                                <div className={`flex ${paymentmethods?.length > 1 ? 'flex-col gap-y-2' : 'items-center gap-x-2'} px-4 py-3 cursor-pointer rounded-xl border border-lightgray -outline-offset-2 hover:border-lightgray hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 bg-neutral-50 ${value == key ? "border-primary-300 outline outline-[1px]" : ""}`}>
                                    {/* <img src={logo} alt={label} className="h-5 w-5 select-none object-cover rounded-[2px]" /> */}
                                    <p className={`text-darkgray  font-bold text-center`}>{name}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </fieldset>
            ) : (
                <div className='flex flex-col gap-y-2'>
                <Skeleton className='h-6 w-full'/>
                <Skeleton className='h-6 w-full'/>
                <Skeleton className='h-6 w-full'/>
                </div>
            )}
        </>
    );
}
