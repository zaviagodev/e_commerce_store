import { useState, useEffect, useMemo, useRef } from 'react';
import { SfCheckbox, SfButton, SfIconCheckCircle, SfIconClose, SfLink, SfInput, SfLoaderCircular, SfIconArrowBack, SfIconExpandMore, SfIconExpandLess, SfDrawer } from '@storefront-ui/react';
import { CSSTransition } from 'react-transition-group';
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
import { getToken } from '../utils/helper';
import { SfRadio, SfListItem } from '@storefront-ui/react';
import AddressForm from '../components/forms/AddressForm';

export default function Checkout(){
    const errorTimer = useRef(0);
    const positiveTimer = useRef(0);
    const informationTimer = useRef(0);
    const [addPromo, setAddPromo] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [informationAlert, setInformationAlert] = useState(false);
    const [positiveAlert, setPositiveAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [checkedState, setCheckedState] = useState('');
    const [shippingRules, setShippingRules] = useState([]);
    const [randomKey, setrandomKey] = useState(0)
    const [showOrderSum, setShowOrderSum] = useState(true)
    const [moreAddresses, setMoreAddresses] = useState(false)

    const {call : CheckPromoCode, loading, error : codeError, result : codeResult, reset, isCompleted : PromoCompleted } = useFrappePostCall('webshop.webshop.shopping_cart.cart.apply_coupon_code');
    const {call : ApplyDeliveryFee, loading : deliveryLoading, result : deliveryResult, error : deliveryError} = useFrappePostCall('webshop.webshop.shopping_cart.cart.apply_shipping_rule');
    const {isLoading : shippingRuleLoading, } = useFrappeGetCall('webshop.webshop.api.get_shipping_methods',undefined, `shippingRules`, {
        isOnline: () => shippingRules.length === 0,
        onSuccess: (data) => setShippingRules(data.message)
    })
    const {call : deleteCoupon, loading : deleteLoading, result : deleteResult, error : deleteError} = useFrappePostCall('webshop.webshop.shopping_cart.cart.remove_coupon_code');

    const { data:addressList } = useFrappeGetCall('headless_e_commerce.api.get_addresses', null, `addresses-${randomKey}`)
    const [addNewAddress, setAddNewAddress] = useState(false);

    useEffect(() => {
        if (!deliveryResult && !deliveryError && !shippingRuleLoading && shippingRules.length > 0 && checkedState == '') {
            const deleteCouponAsync = async () => {
                await deleteCoupon();
            };
            deleteCouponAsync();
            ApplyDeliveryFee({'shipping_rule' : shippingRules[0].name })
            setCheckedState(shippingRules[0].name)
        }
    }, [deliveryResult, deliveryError, shippingRuleLoading, shippingRules])

    useEffect(() => {
        clearTimeout(errorTimer.current);
        errorTimer.current = window.setTimeout(() => setErrorAlert(false), 5000);
        return () => {
          clearTimeout(errorTimer.current);
        };
      }, [codeError]);

      useEffect(() => {
        clearTimeout(positiveTimer.current);
        positiveTimer.current = window.setTimeout(() => setPositiveAlert(false), 5000);
        return () => {
          clearTimeout(positiveTimer.current);
        };
      }, [codeResult]);

      useEffect(() => {
        clearTimeout(informationTimer.current);
        informationTimer.current = window.setTimeout(() => setInformationAlert(false), 5000);
        return () => {
          clearTimeout(informationTimer.current);
        };
      }, [informationAlert]);

      const removePromoCode = async() => {
        reset()
        setInformationAlert(true);
        await deleteCoupon()
        ApplyDeliveryFee({'shipping_rule' : checkedState})
      };
    
      const checkPromoCode = (event) => {
        event.preventDefault();
        CheckPromoCode({"applied_code" : inputValue, "applied_referral_sales_partner" : false}) // change refereer here when we have it
      };

    const { user } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
      if (!getToken() && !user?.name) {
        navigate("/login");
      }
    }, [ user?.name]);

    const { getByItemCode } = useProducts()
    const { cart, cartCount, getTotal, resetCart } = useCart();

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
            loyalty_points: 0,
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
        if (isCompleted ) {
            if (result?.message?.name) {
                resetCart();
                navigate(`/thankyou?order_id=${result.message.name}&amount=${result.message.grand_total}`)
            }
        }
        if (error) { setErrorAlert(JSON.parse(JSON.parse(error?._server_messages)[0]).message) }
        if(deliveryError) { setErrorAlert(JSON.parse(JSON.parse(deliveryError?._server_messages)[0]).message) }
        if(codeError) { setErrorAlert(JSON.parse(JSON.parse(codeError?._server_messages)[0]).message) }
        if(PromoCompleted) { setPositiveAlert(true) }
    }, [isCompleted, error, PromoCompleted, codeError, deliveryError])

    const CouponAlert = () => {
        return (
            <>
                {/* {positiveAlert && (<p className="text-xs">Your promo code has been added.</p>)} */}
                {/* {informationAlert && (<p className="text-xs">Your promo code has been removed.</p>)} */}
                {errorAlert && (<p className="text-xs text-negative-600">{errorAlert}</p>)}
            </>
        )
    }

    const NewAddressForm = () => {
        return (
            <label className="w-full">
                {addressList?.message?.length > 0 ? (<div className='flex items-center justify-between mb-4'>
                    <legend className="font-bold text-neutral-900 text-base">New address</legend>
                    <a className='text-sm hover:underline cursor-pointer inline-block font-medium' onClick={() => setAddNewAddress(false)}>Cancel</a>
                </div>) : null}
                <AddressForm onSuccess={() => setrandomKey(randomKey + 1)}/>
            </label>
        )
    }

    return (
        <main className='main-section-small'>
            <div className='flex items-center gap-x-2 mb-8'>
                <div onClick={() => navigate(-1)} className='cursor-pointer'>
                    <SfIconArrowBack className='text-primary'/>
                </div>
                <h1 className='text-primary text-2xl font-bold'>Checkout</h1>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 justify-center lg:gap-x-[100px]'>
            <div className='w-full mb-8 lg:mb-0'>
                    <div className="flex justify-between items-center pb-6 lg:pb-0 border-b lg:border-0">
                        <p className="typography-headline-4 font-medium md:typography-headline-3">Order Summary</p>
                        <div className='flex items-center gap-x-2'>
                            <h1 className='typography-headline-4 font-bold md:typography-headline-3 lg:hidden'>{deliveryLoading ? <SfLoaderCircular/> : typeof codeResult?.message?.doc?.grand_total == 'undefined' ? deliveryResult?.message?.doc?.grand_total? `฿ ${deliveryResult?.message?.doc?.grand_total + getTotal()}` : `฿ ${getTotal()}` : `฿ ${codeResult?.message?.doc?.grand_total}`}</h1>
                            <p className="typography-text-base text-[#A1A1A1]">(Items: {cartCount})</p>
                            <span onClick={() => setShowOrderSum(!showOrderSum)} className='lg:hidden cursor-pointer'>
                                {showOrderSum ? <SfIconExpandLess /> : <SfIconExpandMore />}
                            </span>
                        </div>
                    </div>
                    <div className={`${showOrderSum ? 'block' : 'hidden'} lg:!block`}>
                        <h1 className='text-[40px] font-bold pt-3 hidden lg:block'>{deliveryLoading ? <SfLoaderCircular/> : typeof codeResult?.message?.doc?.grand_total == 'undefined' ? deliveryResult?.message?.doc?.grand_total? `฿ ${deliveryResult?.message?.doc?.grand_total + getTotal()}` : `฿ ${getTotal()}` : `฿ ${codeResult?.message?.doc?.grand_total}`}</h1>
                        <div className="flex flex-col typography-text-base pt-10 pb-6">
                            {cartCount > 0 ? (
                                <ul className='flex flex-col gap-y-2'>
                                    {Object.entries(cart).map(([itemCode]) => {
                                        const product = getByItemCode(itemCode)
                                        // console.log(product)
                                        return (
                                        <li key={itemCode} className="flex pb-6">
                                            <div className="h-32 w-24 flex-shrink-0 overflow-hidden border border-gray-200">
                                                <img src={product?.website_image} alt={product?.item_name} className="h-full w-full object-cover object-center" />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div className="flex justify-between text-sm text-gray-900 font-medium">
                                                    <h3 className='text-texttag pr-8'>{product?.web_item_name}</h3>
                                                    <p className='whitespace-pre'>{product?.formatted_price}</p>
                                                </div>

                                                <div className="flex justify-between text-sm text-[#A1A1A1] font-medium">
                                                    {cart[itemCode]} {cart[itemCode] === 1 ? 'item' : 'items'}
                                                </div>
                                            </div>
                                        </li>
                                        )
                                    })}
                                </ul>
                            ) : <SfLoaderCircular />}
                        <div className='flex justify-between lg:ml-28 pt-3 border-t'>
                            <div className="flex flex-col grow pr-2">
                                <p className='font-medium text-sm'>Items Subtotal</p>
                                <p className="my-6 font-medium text-sm">Delivery</p>
                                <p className='text-[#A1A1A1] text-sm'>Estimated Sales Tax</p>
                            </div>
                            <div className="flex flex-col text-right">
                                <p className='font-medium text-sm'>{deliveryLoading ? <SfLoaderCircular/> : deliveryResult?.message?.doc?.total ? `฿${deliveryResult?.message?.doc?.total}` : `฿${getTotal()}`}</p>
                                <p className="my-6 text-sm">
                                    {deliveryLoading ? <SfLoaderCircular/> : deliveryResult?.message?.doc?.total_taxes_and_charges ? `฿${deliveryResult?.message?.doc?.total_taxes_and_charges}` : "฿0"}
                                </p>
                                <p></p>
                            </div>
                        </div>
                    </div>
                            <div className='lg:ml-28'>
                            { !loading ? (codeResult ? (
                                <div className='flex flex-col gap-y-2'>
                                    <div className="flex items-center justify-between">
                                        <div className='bg-neutral-100 rounded-md p-[10px] flex items-center gap-x-2 text-sm'>
                                            <p>{codeResult.message.coupon_code.toUpperCase()}</p>
                                            <SfButton size="sm" variant="tertiary" className='!p-0' onClick={removePromoCode}>
                                                <SfIconClose size='sm' className='text-[#A1A1A1]'/>
                                            </SfButton>
                                        </div>
                                        <p className='text-sm'>{codeResult.message.coupon_code.toUpperCase()}</p>
                                    </div>
                                    <CouponAlert />
                                </div>
                            ) : addPromo ? (
                                <form className="flex flex-col gap-y-2" onSubmit={checkPromoCode}>
                                    <div className='flex gap-x-2'>
                                        <SfInput
                                            value={inputValue}
                                            placeholder="Enter promo code"
                                            wrapperClassName={`grow ${errorAlert ? 'border border-negative-600' : ''}`}
                                            onChange={(event) => setInputValue(event.target.value)}
                                            onBlur={() => inputValue === "" && setAddPromo(false)}
                                            onKeyDown={e => e.key === 'Escape' && setAddPromo(false)}
                                            className='text-sm'
                                        />
                                        <SfButton type="submit" className='btn-primary text-sm'>
                                            Apply
                                        </SfButton>
                                    </div>
                                    <CouponAlert />
                                </form>
                            ) : (
                                <a className='text-secondary hover:underline cursor-pointer inline-block font-medium text-sm' onClick={() => setAddPromo(true)}>Add promo code</a>
                            ))
                            : <SfLoaderCircular/>} 
                            {/*<p className="px-3 py-1.5 bg-secondary-100 text-secondary-700 typography-text-sm rounded-lg text-center mb-4">
                                You are saving ${Math.abs(orderDetails.savings).toFixed(2)} on your order today!
                            </p>*/ }
                            </div>
                            <div className="flex justify-between typography-headline-4 md:typography-headline-3 py-6 lg:pt-6 lg:ml-28 border-y lg:border-b-0 mt-6 font-medium">
                                <p className='text-sm'>Total</p>
                                <p>{deliveryLoading ? <SfLoaderCircular/> : typeof codeResult?.message?.doc?.grand_total == 'undefined' ? deliveryResult?.message?.doc?.grand_total? `฿ ${deliveryResult?.message?.doc?.grand_total + getTotal()}` : `฿ ${getTotal()}` : `฿ ${codeResult?.message?.doc?.grand_total}`}</p>
                            </div>
                        {/* <SfInput
                            placeholder='Enter loyalty points to redeem'
                            slotSuffix={<strong className='w-16'>of {user?.loyalty_points}</strong>}
                            maxLength={user?.loyalty_points?.toString().length}
                            name="loyalty_points"
                            value={formik.values.loyalty_points}
                            onChange={formik.handleChange}
                        /> */}
                    </div>
                </div>
                <form className="w-full flex gap-8 flex-wrap text-neutral-900">
                    {cartContents.hasNormalItem && (
                        <>
                            {addressList?.message?.length > 0 ? (
                                <>
                                    <div className='w-full flex flex-col gap-y-2'>
                                        <label className="w-full">
                                            <legend className="mb-8 font-bold text-neutral-900 text-lg">Billing and shipping address</legend>
                                            <div className='flex flex-col gap-y-2'>
                                                <h2 className="font-medium text-sm text-neutral-900">Address <span className='text-red-500'>*</span></h2>
                                                {formik.values.billing_address && !addNewAddress ? (
                                                <div className='border rounded-lg p-3 mb-1'>
                                                    {addressList?.message?.filter(address => address.name === formik.values.billing_address).map(a => (
                                                        <div className='flex flex-col'>
                                                            <h2 className='font-semibold text-base mb-2'>{a.address_title}</h2>
                                                            <p className='text-sm'>{a.city}</p>
                                                            <p className='text-sm'>{a.state}</p>
                                                            <p className='text-sm'>{a.country}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                ) : null}
                                            </div>
                                        </label>
                                        <div className='flex items-center gap-x-4 w-full'>
                                            <SfButton className='btn-secondary w-full text-sm' variant='tertiary' onClick={() => setMoreAddresses(true)}>See more addresses</SfButton>
                                            <SfButton className='btn-secondary w-full text-sm' variant='tertiary' onClick={() => setAddNewAddress(true)}>Add a new address</SfButton>
                                        </div>
                                    </div>
                                    <MoreAddresses isOpen={moreAddresses} setIsOpen={setMoreAddresses}>
                                        <AddressOptions
                                            onChange={value => formik.setFieldValue('billing_address', value)}
                                            value={formik.values.billing_address}
                                            error={formik.errors.billing_address}
                                            randomKey={randomKey}
                                            onClick={() => {setMoreAddresses(false);setAddNewAddress(false)}}
                                        />
                                    </MoreAddresses>
                                </>
                            ) : (
                            <div className='border p-3 rounded-lg'>
                                <NewAddressForm />
                            </div>)}
                            {addNewAddress && (
                                <div className='border p-3 rounded-lg'>
                                    <NewAddressForm />
                                </div>
                            )}
                            {/* <label className="w-full flex items-center gap-2">
                                <SfCheckbox
                                    name="use_different_shipping"
                                    onChange={formik.handleChange}
                                    checked={formik.values.use_different_shipping} />
                                Use different shipping address
                            </label>
                            {formik.values.use_different_shipping && (
                                <AddressOptions
                                    onChange={value => formik.setFieldValue('shipping_address', value)}
                                    value={formik.values.shipping_address}
                                    error={formik.errors.shipping_address}
                                    randomKey={randomKey}
                                />
                                <AddressForm onSuccess={() => setrandomKey(randomKey + 1)}/>
                            )} */}
                                {!shippingRuleLoading ?
                                (<label className='w-full'>
                                    <legend className="mb-2 font-medium text-sm text-neutral-900">Shipping methods <span className='text-red-500'>*</span></legend>
                                    <div className='flex flex-col gap-y-3 font-medium'>
                                        { shippingRules.map(({ name, shipping_amount }) => (
                                            <SfListItem
                                            as="label"
                                            key={name}
                                            disabled={deliveryLoading}
                                            slotPrefix={
                                                <SfRadio
                                                name="delivery-options"
                                                value={name}
                                                Checked={checkedState == name}
                                                className='checked:bg-black !border border-primary flex'
                                                onChange={() => {
                                                    setCheckedState(name);
                                                    ApplyDeliveryFee({'shipping_rule' : name })
                                                }}
                                                />
                                            }
                                            slotSuffix={<span className="text-gray-900">฿{shipping_amount}</span>}
                                            className="w-full border rounded-lg border-neutral-200 !px-3 text-sm"
                                            >
                                            {name}
                                            </SfListItem>
                                        )) }
                                    </div>
                                </label>
                                ) : <SfLoaderCircular/>}
                                {cartContents.hasGiftItem && (
                                    <label className="w-full">
                                        <span className="pb-1 text-sm font-medium text-neutral-900 font-body">Select Branch for Redemption</span>
                                        <BranchSelect
                                            name="branch"
                                            onChange={formik.handleChange}
                                            value={formik.values.branch}
                                            error={formik.errors.branch}
                                        />
                                    </label>
                                )}
                            <PaymentMethods onChange={value => formik.setFieldValue('payment_method', value)} value={formik.values.payment_method} error={formik.errors.payment_method} />
                        </>
                    )}
                    <div className='w-full'>
                        <SfButton size="lg" className="w-full bg-btn-primary text-btn-primary-foreground text-sm" onClick={formik.handleSubmit}>
                            Place Order
                        </SfButton>
                        <div className="typography-text-sm mt-3 text-sm text-primary">
                            By placing my order, you agree to our <SfLink href="#" className='text-[#006AFF] no-underline'>Terms and Conditions</SfLink> and our{' '}
                            <SfLink href="#" className='text-[#006AFF] no-underline'>Privacy Policy.</SfLink>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}

const MoreAddresses = ({isOpen, setIsOpen, children}) => {
    const nodeRef = useRef(null);
    const drawerRef = useRef(null);

    return (
        <CSSTransition
            ref={nodeRef}
            in={isOpen}
            timeout={500}
            unmountOnExit
            classNames={{
                enter: 'translate-x-full',
                enterActive: 'translate-x-0',
                enterDone: 'translate-x-0 transition duration-500 ease-in-out',
                exitDone: 'translate-x-0',
                exitActive: 'translate-x-full transition duration-500 ease-in-out',
            }}
        >
            <SfDrawer
                ref={drawerRef}
                placement='right'
                open
                onClose={() => setIsOpen(false)}
                className="bg-neutral-50 z-99 md:w-[500px] w-full box-border"
            >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-3 px-4 py-6 sm:px-6 border-b">
                            <div className="flex h-7 items-center">
                                <button onClick={() => setIsOpen(false)} type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Close panel</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <h2 className="text-lg font-medium text-gray-900 text-center" id="slide-over-title">My Addresses</h2>
                        </div>
                        <div className="mt-8">
                            <div className="flow-root px-4 sm:px-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </SfDrawer>
        </CSSTransition>
    );
}

function AddressOptions({
    value,
    onChange,
    error,
    randomKey = 0,
    limit,
    onClick
}) {
    const { data } = useFrappeGetCall('headless_e_commerce.api.get_addresses', null, `addresses-${randomKey}`)

    const handleSelect = (val) => {
        onChange(val);
        onClick()
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-3">
                {data?.message?.map(({ name: nameVal, address_title, address_line2 = null, city, state, country }) => (
                    <label key={nameVal} className="relative xs:w-full md:w-auto" onClick={() => handleSelect(nameVal)}>
                        <div className={`cursor-pointer rounded-lg -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 ${value == nameVal ? "border-primary-300 bg-primary-100 outline outline-2 outline-primary-700" : ""}`}>
                            <AddressCard title={address_title} addressLine2={address_line2} city={city} state={state === "Select One" ? null : state} country={country} />
                        </div>
                    </label>
                )).slice(0, limit || data?.message?.length)}
            </div>
            {error && <p className="text-negative-600 mt-3 text-sm font-medium">Please select an address</p>}
        </>
    );
}