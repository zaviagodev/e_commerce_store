import { useState, useEffect, useMemo } from 'react';
import { SfCheckbox, SfButton, SfIconCheckCircle, SfIconClose, SfLink, SfInput } from '@storefront-ui/react';
import { useCart } from '../hooks/useCart';
import PaymentMethods from '../components/PaymentMethods';
import AddressCard from '../components/AddressCard';
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';
import { useFormik } from 'formik';
import { orderSchema } from '../components/forms/orderSchema';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import BranchSelect from '../components/form-controls/BranchSelect';
import { useUser } from '../hooks/useUser';


const Checkout = () => {
    const { user } = useUser()
    const { getByItemCode } = useProducts()
    const { cart, cartCount, getTotal, resetCart } = useCart();
    const navigate = useNavigate();

    const cartContents = useMemo(() => {
        return Object.entries(cart).reduce((acc, [item_code]) => {
            const product = getByItemCode(item_code);
            if (product?.item_group === 'Gift' || product?.item_group === 'Gift and Cards') {
                return {
                    ...acc,
                    hasGiftItem: true,
                }
            }
            return {
                ...acc,
                hasNormalItem: true,
            }
        }, {
            hasNormalItem: false,
            hasGiftItem: false,
        })
    }, [cart, getByItemCode])

    const { call, isCompleted, result, error } = useFrappePostCall('headless_e_commerce.api.place_order');

    const formik = useFormik({
        initialValues: {
            cartContents,
            billing_address: '',
            shipping_address: '',
            use_different_shipping: false,
            loyalty_points: '',
            items: cart,
            payment_method: 'bank-transfer',
            branch: '',
        },
        validationSchema: orderSchema,
        validateOnChange: false,
        onSubmit: call
    });

    useEffect(() => {
        formik.setFieldValue('items', Object.entries(cart).map(([item_code, qty]) => ({ item_code, qty })))
        formik.setFieldValue('cartContents', cartContents)
    }, [cartCount, cartContents])

    useEffect(() => {
        if (isCompleted) {
            if (result?.message?.name) {
                resetCart();
                navigate(`/thankyou?order_id=${result.message.name}&amount=${result.message.grand_total}`)
            }
        }
        if (error) {
            setErrorAlert(JSON.parse(JSON.parse(error?._server_messages)[0]).message);
        }
    }, [isCompleted, error])


    const [informationAlert, setInformationAlert] = useState(false);
    const [positiveAlert, setPositiveAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);


    return (
        <div className='flex flex-col md:flex-row gap-8 justify-center'>
            <form className="p-4 md:w-3/5 flex gap-4 flex-wrap text-neutral-900">
                {
                    cartContents.hasNormalItem && (
                        <>
                            <label className="w-full">
                                <legend className="mb-4 font-bold text-neutral-900">Address</legend>
                                <AddressOptions
                                    onChange={value => formik.setFieldValue('billing_address', value)}
                                    value={formik.values.billing_address}
                                    error={formik.errors.billing_address}
                                />
                            </label>
                            <label className="w-full flex items-center gap-2">
                                <SfCheckbox
                                    name="use_different_shipping"
                                    onChange={formik.handleChange}
                                    checked={formik.values.use_different_shipping} />
                                Use different shipping address
                            </label>
                            {
                                formik.values.use_different_shipping && (
                                    <AddressOptions
                                        onChange={value => formik.setFieldValue('shipping_address', value)}
                                        value={formik.values.shipping_address}
                                        error={formik.errors.shipping_address}
                                    />
                                )
                            }
                            <PaymentMethods onChange={value => formik.setFieldValue('payment_method', value)} value={formik.values.payment_method} error={formik.errors.payment_method} />
                        </>
                    )
                }
                {
                    cartContents.hasGiftItem && (
                        <label className="w-full">
                            <span className="pb-1 text-sm font-medium text-neutral-900 font-body">Select Branch for Redemption</span>
                            <BranchSelect
                                name="branch"
                                onChange={formik.handleChange}
                                value={formik.values.branch}
                                error={formik.errors.branch}
                            />
                        </label>
                    )
                }
            </form>
            <div className='p-4 md:w-2/5'>
                <div className="md:shadow-lg md:rounded-md md:border md:border-neutral-100">
                    <div className="flex justify-between items-end bg-neutral-100 md:bg-transparent py-2 px-4 md:px-6 md:pt-6 md:pb-4">
                        <p className="typography-headline-4 font-bold md:typography-headline-3">Order Summary</p>
                        <p className="typography-text-base font-medium">(Items: {cartCount})</p>
                    </div>
                    <div className="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
                        <div className="flex justify-between typography-text-base pb-4">
                            <div className="flex flex-col grow pr-2">
                                <p>Items Subtotal</p>
                                <p className="my-2">Delivery</p>
                                <p>Estimated Sales Tax</p>
                            </div>
                            <div className="flex flex-col text-right">
                                <p>฿ {getTotal()}</p>
                                <p className="my-2">฿ 0</p>
                                <p>฿ 0</p>
                            </div>
                        </div>
                        {/* {promoCode ? (
                            <div className="flex items-center mb-5 py-5 border-y border-neutral-200">
                                <p>PromoCode</p>
                                <SfButton size="sm" variant="tertiary" className="ml-auto mr-2" onClick={removePromoCode}>
                                    Remove
                                </SfButton>
                                <p>{formatPrice(promoCode)}</p>
                            </div>
                        ) : (
                            <form className="flex gap-x-2 py-4 border-y border-neutral-200 mb-4" onSubmit={checkPromoCode}>
                                <SfInput
                                    value={inputValue}
                                    placeholder="Enter promo code"
                                    wrapperClassName="grow"
                                    onChange={(event) => setInputValue(event.target.value)}
                                />
                                <SfButton type="submit" variant="secondary">
                                    Apply
                                </SfButton>
                            </form>
                        )} */}
                        {/* <p className="px-3 py-1.5 bg-secondary-100 text-secondary-700 typography-text-sm rounded-md text-center mb-4">
                            You are saving ${Math.abs(orderDetails.savings).toFixed(2)} on your order today!
                        </p> */}
                        <div className="flex justify-between typography-headline-4 md:typography-headline-3 font-bold pb-4 mb-4 border-b border-neutral-200">
                            <p>Total</p>
                            <p>฿ {getTotal()}</p>
                        </div>

                        <SfInput
                            placeholder='Enter loyalty points to redeem'
                            slotSuffix={<strong className='w-16'>of {user?.loyalty_points}</strong>}
                            maxLength={user?.loyalty_points?.toString().length}
                            name="loyalty_points"
                            value={formik.values.loyalty_points}
                            onChange={formik.handleChange}
                        />
                        <SfButton size="lg" className="w-full mt-4" onClick={formik.handleSubmit}>
                            Place Order
                        </SfButton>
                        <div className="typography-text-sm mt-4 text-center">
                            By placing my order, you agree to our <SfLink href="#">Terms and Conditions</SfLink> and our{' '}
                            <SfLink href="#">Privacy Policy.</SfLink>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 mx-2 mt-2 sm:mr-6">
                    {positiveAlert && (
                        <div
                            role="alert"
                            className="flex items-start md:items-center shadow-md max-w-[600px] bg-positive-100 pr-2 pl-4 mb-2 ring-1 ring-positive-200 typography-text-sm md:typography-text-base py-1 rounded-md"
                        >
                            <SfIconCheckCircle className="mr-2 my-2 text-positive-700" />
                            <p className="py-2 mr-2">Your promo code has been added.</p>
                            <button
                                type="button"
                                className="p-1.5 md:p-2 ml-auto rounded-md text-positive-700 hover:bg-positive-200 active:bg-positive-300 hover:text-positive-800 active:text-positive-900"
                                aria-label="Close positive alert"
                                onClick={() => setPositiveAlert(false)}
                            >
                                <SfIconClose className="hidden md:block" />
                                <SfIconClose size="sm" className="md:hidden block" />
                            </button>
                        </div>
                    )}
                    {informationAlert && (
                        <div
                            role="alert"
                            className="flex items-start md:items-center shadow-md max-w-[600px] bg-positive-100 pr-2 pl-4 mb-2 ring-1 ring-positive-200 typography-text-sm md:typography-text-base py-1 rounded-md"
                        >
                            <SfIconCheckCircle className="mr-2 my-2 text-positive-700" />
                            <p className="py-2 mr-2">Your promo code has been removed.</p>
                            <button
                                type="button"
                                className="p-1.5 md:p-2 ml-auto rounded-md text-positive-700 hover:bg-positive-200 active:bg-positive-300 hover:text-positive-800 active:text-positive-900"
                                aria-label="Close positive alert"
                                onClick={() => setInformationAlert(false)}
                            >
                                <SfIconClose className="hidden md:block" />
                                <SfIconClose size="sm" className="md:hidden block" />
                            </button>
                        </div>
                    )}
                    {errorAlert && (
                        <div
                            role="alert"
                            className="flex items-start md:items-center max-w-[600px] shadow-md bg-negative-100 pr-2 pl-4 ring-1 ring-negative-300 typography-text-sm md:typography-text-base py-1 rounded-md"
                        >
                            <p className="py-2 mr-2">{errorAlert}</p>
                            <button
                                type="button"
                                className="p-1.5 md:p-2 ml-auto rounded-md text-negative-700 hover:bg-negative-200 active:bg-negative-300 hover:text-negative-800 active:text-negative-900"
                                aria-label="Close error alert"
                                onClick={() => setErrorAlert(false)}
                            >
                                <SfIconClose className="hidden md:block" />
                                <SfIconClose size="sm" className="md:hidden block" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );

}

export default Checkout

function AddressOptions({
    value,
    onChange,
    error
}) {
    const { data } = useFrappeGetCall('headless_e_commerce.api.get_addresses', null, `addresses-0`)

    return (
        <>
            <div className="flex flex-wrap gap-4 lg:gap-6">
                {data?.message?.map(({ name: nameVal, address_title, address_line2 = null, city, state, country }) => (
                    <label key={nameVal} className="relative xs:w-full md:w-auto" onClick={() => onChange(nameVal)}>
                        <div className={`cursor-pointer rounded-md -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 ${value == nameVal ? "border-primary-300 bg-primary-100 outline outline-2 outline-primary-700" : ""}`}>
                            <AddressCard title={address_title} addressLine2={address_line2} city={city} state={state === "Select One" ? null : state} country={country} />
                        </div>
                    </label>
                ))}
            </div>
            {
                error && <p className="text-negative-600">Please select an address</p>
            }
        </>
    );
}
