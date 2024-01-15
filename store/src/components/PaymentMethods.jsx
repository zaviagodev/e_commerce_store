// List of payment methods
import qrmock from '../assets/qrmock.png'
const paymentMethods = [
    {
        label: 'Bank Transfer',
        value: 'bank-transfer',
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
            <legend className="mb-4 font-bold text-neutral-900">Payment methods</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                {paymentMethods.map(({ label, value: nameVal, logo }) => (
                    <label key={nameVal} className="relative" onClick={() => onChange(nameVal)}>
                        <div className={`h-full flex ${paymentMethods?.length > 1 ? 'flex-col gap-y-2' : 'items-center gap-x-2'} p-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 ${value == nameVal ? "border-primary-300 bg-primary-100 outline outline-2 outline-primary-700" : ""}`}>
                            <img src={logo} alt={label} className="h-10 w-10 select-none object-cover rounded-md" />
                            <p className={`${value == nameVal ? 'text-black' : 'text-[#A1A1A1]'}`}>Cash</p>
                        </div>
                    </label>
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </fieldset>
    );
}
