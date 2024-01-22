// List of payment methods
import qrmock from '../assets/qrmock.png'
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
    return (
        <fieldset className="w-full">
            <legend className="mb-2 font-medium text-basesm text-secgray">วิธีการชำระเงิน</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                {paymentMethods.map(({ label, value: nameVal, logo }) => (
                    <label key={nameVal} className="relative" onClick={() => onChange(nameVal)}>
                        <div className={`h-full flex ${paymentMethods?.length > 1 ? 'flex-col gap-y-2' : 'items-center gap-x-2'} px-4 py-[18px] cursor-pointer rounded-lg border border-lightgray -outline-offset-2 hover:border-lightgray hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 bg-neutral-50 ${value == nameVal ? "border-primary-300 outline outline-[1px]" : ""}`}>
                            {/* <img src={logo} alt={label} className="h-5 w-5 select-none object-cover rounded-[2px]" /> */}
                            <p className={`${value == nameVal ? 'text-black' : 'text-maingray'} text-basesm font-medium text-center`}>{label}</p>
                        </div>
                    </label>
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </fieldset>
    );
}
