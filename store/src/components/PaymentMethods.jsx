// List of payment methods
import qrmock from '../assets/qrmock.png'
import { Skeleton } from './Skeleton';
const paymentMethods = [
    {
        label: 'QR พร้อมเพย์',
        value: 'QR พร้อมเพย์',
        logo: qrmock,
    },
    {
        label: 'โอนเงินผ่านธนาคาร',
        value: 'โอนเงินผ่านธนาคาร',
        logo: qrmock,
    }
];

export default function PaymentMethods({
    onChange,
    value,
    error
}) {
    return (
        <>
            {paymentMethods ? (
                <fieldset className="w-full">
                    <legend className="mb-2 font-semibold text-secgray">วิธีการชำระเงิน</legend>
                    <div className={`grid ${paymentMethods?.length == 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 items-stretch`}>
                        {paymentMethods.map(({ label, value: nameVal, logo }) => (
                            <label key={nameVal} className="relative" onClick={() => onChange(nameVal)}>
                                <div className={`flex ${paymentMethods?.length > 1 ? 'flex-col gap-y-2' : 'items-center gap-x-2'} px-4 py-3 cursor-pointer rounded-xl border border-lightgray -outline-offset-2 hover:border-lightgray hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 bg-neutral-50 ${value == nameVal ? "border-primary-300 outline outline-[1px]" : ""}`}>
                                    {/* <img src={logo} alt={label} className="h-5 w-5 select-none object-cover rounded-[2px]" /> */}
                                    <p className={`text-darkgray  font-bold text-center`}>{label}</p>
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
