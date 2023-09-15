// List of payment methods
const paymentMethods = [
    {
        label: 'Bank Transfer',
        value: 'bank-transfer',
        logo: 'https://w7.pngwing.com/pngs/859/737/png-transparent-wire-transfer-bank-payment-money-electronic-funds-transfer-bank-blue-text-service.png',
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
            <div className="grid grid-cols-2 gap-4 items-stretch">
                {paymentMethods.map(({ label, value: nameVal, logo }) => (
                    <label key={nameVal} className="relative" onClick={() => onChange(nameVal)}>
                        <div className={`h-full flex flex-col items-center justify-center py-7 px-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 ${value == nameVal ? "border-primary-300 bg-primary-100 outline outline-2 outline-primary-700" : ""}`}>
                            <img src={logo} alt={label} className="h-10 select-none" />
                        </div>
                    </label>
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </fieldset>
    );
}
