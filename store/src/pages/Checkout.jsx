import { useState, useEffect, useMemo, useRef } from 'react';
import { SfCheckbox, SfButton, SfIconCheckCircle, SfIconClose, SfLink, SfInput, SfLoaderCircular, SfIconArrowBack, SfIconExpandMore, SfIconExpandLess, SfDrawer, SfIconArrowForward } from '@storefront-ui/react';
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
import { Skeleton } from '../components/Skeleton';
import { useSetting } from '../hooks/useWebsiteSettings';
import defaultLogo from '../assets/defaultBrandIcon.svg'
import { Icons } from '../components/icons';
import classNames from 'classnames'
import AddressDrawer from '../components/drawers/AddressDrawer';
import MobileCheckoutDrawer from '../components/drawers/MobileCheckoutDrawer';

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
    const [morePayments, setMorePayments] = useState(false)

    const {appName, appLogo,defaultTaxe ,hideLogin, hideCheckout, navbarSearch, topBarItems, hideWish, isLoading} = useSetting()
    const {call : CheckPromoCode, loading, error : codeError, result : codeResult, reset, isCompleted : PromoCompleted } = useFrappePostCall('webshop.webshop.shopping_cart.cart.apply_coupon_code');
    const {call : ApplyDeliveryFee, loading : deliveryLoading, result : deliveryResult, error : deliveryError} = useFrappePostCall('webshop.webshop.shopping_cart.cart.apply_shipping_rule');
    const {isLoading : shippingRuleLoading, } = useFrappeGetCall('webshop.webshop.api.get_shipping_methods',undefined, `shippingRules`, {
        isOnline: () => shippingRules.length === 0,
        onSuccess: (data) => setShippingRules(data.message)
    })
    const {call : deleteCoupon, loading : deleteLoading, result : deleteResult, error : deleteError} = useFrappePostCall('webshop.webshop.shopping_cart.cart.remove_coupon_code');
    const { call: updatecart, isCompleted: cartupdated } = useFrappePostCall('webshop.webshop.api.update_cart');


    const { data:addressList } = useFrappeGetCall('headless_e_commerce.api.get_addresses', null, `addresses-${randomKey}`)
    const [addNewAddress, setAddNewAddress] = useState(false);

    useEffect(() => {
        if (!deliveryResult && !deliveryError && !shippingRuleLoading && shippingRules.length > 0 && checkedState == '') {
            const deleteCouponAsync = async () => {
                await deleteCoupon();
            };
            deleteCouponAsync();
            ApplyDeliveryFee({'shipping_rule' : shippingRules[0].name })

            formik.setFieldValue('billing_address', addressList?.message[0]?.name);

            setCheckedState(shippingRules[0].name);
            formik.setFieldValue('shipping_method', shippingRules[0].name) 
        }
    }, [deliveryResult, deliveryError, shippingRuleLoading, shippingRules,addressList])

    useEffect(() => {
        clearTimeout(errorTimer.current);
        errorTimer.current = window.setTimeout(() => setErrorAlert(false), 5000);
        return () => {
          clearTimeout(errorTimer.current);
        };
      }, [codeError]);

      useEffect(() => {
        ApplyDeliveryFee({'shipping_rule' : "" })
      }, [shippingRules]);

      useEffect(() => {
        updatecart({"cart":cart});
      }, [cart]);
      
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

    const { user } =  useUser();
    const navigate = useNavigate();
    useEffect(() => {
      if (!getToken() && !user?.name) {
        navigate("/login");
      }
    }, [ user?.name]);

    const { getByItemCode, isLoading:isProductLoading, settingPage } = useProducts()
    const { cart, cartCount, getTotal, resetCart } = useCart();

    useEffect(() => {
        updatecart({"cart":cart});
      }, [cart]);
    const { getByItemCode } = useProducts()

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
            payment_method: '',
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
                navigate(`/thankyou?order_id=${result.message.name}&amount=${result.message.grand_total}&payment_method=${result.message.custom_payment_method}`)
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
                {/* {positiveAlert && (<p className="text-sm">Your promo code has been added.</p>)} */}
                {/* {informationAlert && (<p className="text-sm">Your promo code has been removed.</p>)} */}
                {errorAlert && (<p className="text-sm text-red-500">{errorAlert}</p>)}
            </>
        )
    }

    const UpdateAddresses = () => {
        setAddNewAddress(false);
        setrandomKey(randomKey + 1);
        setMoreAddresses(true);
    }


    const NewAddressForm = () => {
        return (
            <label className="w-full">
                {addressList?.message?.length > 0 ? (<div className='flex items-center justify-between mb-4'>
                    <legend className="font-bold text-neutral-900 text-base">New address</legend>
                    <a className='text-base hover:underline cursor-pointer inline-block font-medium' onClick={() => setAddNewAddress(false)}>Cancel</a>
                </div>) : null}
                <AddressForm onFormSubmit={() => UpdateAddresses() }/>
            </label>
        )
    }

    const handleAddNewAddress = () => {
        setAddNewAddress(true);
        setMoreAddresses(false)
    }

    const ProductLists = () => {
        return (
            <div className="flex flex-col overflow-scroll h-[50vh] lg:h-full lg:pt-[50px] pb-4">
                {cartCount > 0 && (
                    <ul className='flex flex-col gap-y-4'>
                        {Object.entries(cart).map(([itemCode]) => {
                            const product = getByItemCode(itemCode);
                            return (
                            <>
                                {!isProductLoading ? (
                                    <li key={itemCode} className="flex pb-5">
                                        <div className="h-[53px] w-[53px] flex-shrink-0 overflow-hidden">
                                            <img src={product?.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`} className="h-full w-full object-cover object-center fade-in"/>
                                        </div>

                                        <div className="ml-[10px] flex flex-1 flex-col gap-y-0.5">
                                            <div className="flex justify-between text-gray-900">
                                                <h3 className='text-darkgray pr-8'>{product?.web_item_name}</h3>
                                                <p className='whitespace-pre font-bold text-base'>{product?.formatted_price.toLocaleString()}</p>
                                            </div>

                                            <div className="flex justify-between text-black font-bold">
                                                {cart[itemCode]} ชิ้น
                                            </div>
                                        </div>
                                    </li>
                                ) : (
                                    <div className='flex justify-between mb-4'>
                                        <div className='flex gap-x-2'>
                                            <Skeleton className='h-[53px] w-[53px]'/>
                                            <Skeleton className='h-4 w-[100px]'/>
                                        </div>
                                        <Skeleton className='h-4 w-[100px]'/>
                                    </div>
                                )}
                            </>
                            )
                        })}
                    </ul>
                )}
            </div>
        )
    }

    const CouponForm = () => {
        return (
        <div>
            {!isProductLoading ? (codeResult ? (
                <div className='flex flex-col gap-y-2 py-[5px] mt-[17px]'>
                    <div className="flex items-center justify-between">
                        <div className='bg-neutral-100 rounded-xl px-3 py-[10px] flex items-center gap-x-2 text-[20px] text-secgray leading-[10px]'>
                            <div className='flex items-center gap-x-[5px]'>
                                <Icons.ticket01 color="#979797" />
                                <p>{codeResult.message.coupon_code.toUpperCase()}</p>
                            </div>
                            <SfButton size="sm" variant="tertiary" className='!p-0' onClick={removePromoCode}>
                                <Icons.x color="#979797"/>
                            </SfButton>
                        </div>
                        <p className=''>{codeResult.message.coupon_code.toUpperCase()}</p>
                    </div>
                    <CouponAlert />
                </div>
            ) : addPromo ? (
                <form className="flex flex-col gap-y-2 py-[5px] mt-[17px]" onSubmit={checkPromoCode}>
                    <div className='flex gap-x-[10px]'>
                        <SfInput
                            value={inputValue}
                            placeholder="ใส่คูปองส่วนลด"
                            wrapperClassName={`grow rounded-xl focus-within:ring-0 focus-within:outline-none ${errorAlert ? 'border border-red-500/50' : ''}`}
                            onChange={(event) => setInputValue(event.target.value)}
                            onBlur={() => inputValue === "" && setAddPromo(false)}
                            onKeyDown={e => e.key === 'Escape' && setAddPromo(false)}
                            className=''
                            autoFocus={true}
                        />
                        <SfButton className='btn-primary rounded-xl' onClick={checkPromoCode}>
                            ใช้งาน
                        </SfButton>
                    </div>
                    <CouponAlert />
                </form>
            ) : (
                <a className='text-secondary hover:underline cursor-pointer inline-block mt-[33px] mb-[17px] leading-[10px]' onClick={setAddPromo}>ใส่คูปองส่วนลด</a>
            )) : <Skeleton className='h-6 w-[100px]'/>} 
            {/*<p className="px-3 py-1.5 bg-secondary-100 text-secondary-700 typography-text-base rounded-xl text-center mb-4">
                You are saving ${Math.abs(orderDetails.savings).toFixed(2)} on your order today!
            </p>*/ }
        </div>
        )
    }

    const CheckoutDetails = ({addCoupon}) => {
        return (
            <div className='lg:ml-[98px]'>
            <div className='flex justify-between pt-[21px] border-t'>
                <div className="flex flex-col pr-2 gap-y-[21px]">
                    <p>ยอดรวมย่อย</p>
                    <p className="text-maingray">ค่าจัดส่ง</p>
                    <p className='text-maingray'>
                    ภาษีสินค้า
                    {defaultTaxe && ` (${
                        defaultTaxe?.rate !== 0 ? defaultTaxe?.rate+'%' : ''
                    }${
                        defaultTaxe?.rate !== 0 && defaultTaxe?.amout !== 0 ? ' + ' : ''
                    }${
                        defaultTaxe?.amout !== 0 ? +defaultTaxe?.amout + '฿' : ''
                    })`}
                    </p>
                </div>
                <div className="flex flex-col text-right gap-y-[21px]">
                    <p className='font-semibold'>{isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : deliveryResult?.message?.doc?.total ? `฿${deliveryResult?.message?.doc?.total.toLocaleString()}` : `฿${getTotal().toLocaleString()}`}</p>
                    <p className="text-maingray font-semibold">
                        {isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : deliveryResult?.message?.doc?.total_taxes_and_charges ? `฿${deliveryResult?.message?.doc?.total_taxes_and_charges.toLocaleString()}` : "฿0"}
                    </p>
                    <p className='text-maingray  leading-[10px]'>-</p>
                </div>
            </div>
            {addCoupon}
            <div className="flex justify-between typography-headline-4 md:typography-headline-3 py-4 lg:pt-4 border-t mt-4">
                <p>ยอดชำระเงินทั้งหมด</p>
                <p className='text-right'>{isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : typeof codeResult?.message?.doc?.grand_total == 'undefined' ? deliveryResult?.message?.doc?.grand_total ? `฿ ${deliveryResult?.message?.doc?.grand_total.toLocaleString()}` : 'Your address is not supported' : `฿ ${codeResult?.message?.doc?.grand_total.toLocaleString()}`}</p>
            </div>
        </div>
        )
    }

    return (
        <main className='main-section-small'>
            <div className='grid grid-cols-1 lg:grid-cols-2 justify-center gap-x-10'>
                <div className='w-full lg:py-5 lg:pr-[43px]'>
                    <div className='flex items-center justify-between lg:mb-16 h-[52px] lg:h-10 p-4 border-b lg:border-0'>
                        <div className='flex items-center gap-x-4'>
                            <div onClick={() => navigate(-1)} className='cursor-pointer'>
                                <Icons.flipBackward color='#A9A9A9'/>
                            </div>
                            {appLogo === null ? (
                                <Skeleton className='h-8 w-[120px]'/>
                            ) : (
                                <picture>
                                <source srcSet={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo} media="(min-width: 768px)" />
                                <img
                                    src={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo}
                                    alt="Sf Logo"
                                    className='max-h-10'
                                />
                                </picture>
                            )}
                        </div>
                        <div className='lg:hidden'>
                            <a className=' text-secgray cursor-pointer' onClick={() => setShowOrders(true)}>ข้อมูลตะกร้า</a>

                            <MobileCheckoutDrawer isOpen={showOrders} setIsOpen={setShowOrders} title='ทำการสั่งซื้อ'>
                                <ProductLists />
                                <CheckoutDetails />
                            </MobileCheckoutDrawer>
                        </div>
                    </div>
                    <div className='pt-[43px] lg:pt-0'>
                        <div className="flex flex-col items-center lg:pl-[21px]">
                            {Object.entries(cart).map(([itemCode]) => {
                                const product = getByItemCode(itemCode)
                                return (
                                    <>{!isProductLoading ? (
                                        <img onClick={() => setShowOrders(true)} src={product?.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`} className="h-[120px] w-[120px] object-cover object-center rounded-[5px] mb-4 lg:hidden"/>
                                    ) : (
                                        <Skeleton className='h-[120px] w-[120px] mb-4 lg:hidden'/>
                                    )}</>
                                )
                            }).slice(0, 1)}
                            <div className='flex items-center justify-center lg:justify-between w-full'>
                                <p className="text-sm text-secgray leading-[9px]">ยอดรวมทั้งหมด</p>
                                {isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : <p className="text-secgray text-sm leading-[9px] ml-1">{cartCount} ชิ้น</p>}
                            </div>
                        </div>
                        <div className={`px-4 lg:pl-[21px] lg:pr-[19px]`}>
                            <h1 className='text-4xl font-bold pt-[26px] text-center lg:text-left'>{isProductLoading ? <Skeleton className='h-8 w-[100px]'/> : typeof codeResult?.message?.doc?.grand_total == 'undefined' ? deliveryResult?.message?.doc?.grand_total ? `฿ ${deliveryResult?.message?.doc?.grand_total.toLocaleString()}` : 'Change address' : `฿ ${codeResult?.message?.doc?.grand_total.toLocaleString()}` }</h1>
                            <div className='hidden lg:block'>
                                <ProductLists />
                                <CheckoutDetails addCoupon={<CouponForm />}/>
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
                </div>
                <form className="w-full flex flex-col gap-10 text-neutral-900 p-4 lg:p-[60px] lg:pt-[7.75em] min-h-screen lg:shadow-checkout">
                    {cartContents.hasNormalItem ? (
                        <>
                            {addressList ? (
                                <>{addressList?.message?.length > 0 ? (
                                    <>
                                        <div className='w-full flex flex-col gap-y-2'>
                                            <label className="w-full">
                                                <legend className="font-bold text-darkgray text-base hidden lg:block">ข้อมูลการจัดส่ง*</legend>
                                                {!addNewAddress ? (
                                                    <div className='flex flex-col gap-y-2 mt-8'>
                                                        <h2 className="font-semibold text-secgray hidden lg:block">ที่อยู่*</h2>
                                                        <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                                            <a className='p-6 flex items-center justify-between w-full cursor-pointer' onClick={() => setMoreAddresses(true)}>
                                                                <div className='flex items-center gap-x-2'>
                                                                    <Icons.marketPin04 color='#666666' className='min-w-6'/>
                                                                    <span className=' font-bold text-darkgray'>{formik.values.billing_address ? addressList?.message?.find(address => address.name === formik.values.billing_address).address_title : 'เพิ่ม / เลือกที่อยู่การจัดส่ง'}</span>
                                                                </div>
                                                                <SfIconArrowForward />
                                                            </a>
                                                            {(formik.values.billing_address && !addNewAddress) && (
                                                                <>
                                                                    <div className='p-6 pt-0'>
                                                                        {addressList?.message?.filter(address => address.name === formik.values.billing_address).map(a => (
                                                                            <div className='flex flex-col gap-y-1'>
                                                                                <p>{a.address_line1}</p>
                                                                                <p>{a.address_line2}</p>
                                                                                <p>{a.city}</p>
                                                                                <p>{a.state}</p>
                                                                                <p>{a.country}</p>
                                                                                <p>{a.phone}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className='h-[9px] w-full post-gradient mt-[5px]'/>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </label>
                                        </div>
                                        <AddressDrawer isOpen={moreAddresses} setIsOpen={setMoreAddresses} title='เลือกที่อยู่'>
                                            <AddressOptions
                                                onChange={value => {formik.setFieldValue('billing_address', value); }}
                                                value={formik.values.billing_address}
                                                error={formik.errors.billing_address}
                                                randomKey={randomKey}
                                                onClick={() => {setMoreAddresses(false);setAddNewAddress(false)}}
                                            />
                                            <div className='fixed bottom-0 shadow-main p-6 right-0 w-full md:w-[386px] bg-white'>
                                                <SfButton className='btn-primary w-full text-base h-[50px] rounded-xl' variant='tertiary' onClick={handleAddNewAddress}>เพิ่มที่อยู่ใหม่</SfButton>
                                            </div>
                                        </AddressDrawer>
                                    </>
                                ) : <NewAddressForm />}</>
                            ) : (
                                <div>
                                    <Skeleton className='h-5 w-[100px] mb-8'/>
                                    <div className='flex flex-col gap-y-2'>
                                        <Skeleton className='h-5 w-[60px]'/>
                                        <Skeleton className='h-[72px] w-full'/>
                                    </div>
                                </div>
                            )}

                            {addNewAddress && (
                                <NewAddressForm />
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
                                {!shippingRuleLoading && addressList ?
                                (<>
                                <label className='w-full'>
                                    <legend className="mb-2 font-semibold text-secgray">ตัวเลือกการจัดส่ง*</legend>
                                    <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                        {shippingRules?.length > 0 ? (
                                            <a className='px-6 py-[18px] flex items-center justify-between w-full cursor-pointer' onClick={() => setMorePayments(true)}>
                                                <div className='flex items-center justify-between w-full'>
                                                    <div className='flex items-center gap-x-2'>
                                                        <Icons.truck01 color='#595959'/>
                                                        <span className=' font-bold text-darkgray'>{checkedState ? checkedState : 'หรือเลือกวิธีการจัดส่งที่ต้องการ'}</span>
                                                    </div>
                                                    <div className='flex items-center gap-x-2'>
                                                        <span className=' font-bold text-darkgray'>{checkedState ? `฿${shippingRules?.find(rule => rule.name === checkedState).shipping_amount.toLocaleString()}` : null}</span>
                                                        <SfIconArrowForward />
                                                    </div>
                                                </div>
                                            </a>
                                        ) : (
                                            <div className='px-6 py-[18px] flex items-center gap-x-2'>
                                                <Icons.truck01 color='#595959'/>
                                                <span className='text-secgray'>ไม่มีตัวเลือกในการจัดส่ง</span>
                                            </div>
                                        )}
                                    </div>
                                </label>
                                <AddressDrawer isOpen={morePayments} setIsOpen={setMorePayments} title='เลือกการจัดส่ง'>
                                    <div className='flex flex-col gap-y-3'>
                                        { shippingRules.map(({ name, shipping_amount }) => (
                                            <SfListItem
                                            as="label"
                                            key={name}
                                            disabled={isProductLoading}
                                            slotPrefix={
                                                <SfRadio
                                                name="delivery-options"
                                                value={name}
                                                Checked={checkedState == name}
                                                className='checked:bg-black !border border-primary flex hidden'
                                                onChange={() => {
                                                    setCheckedState(name);
                                                    formik.setFieldValue('shipping_method', name);
                                                    ApplyDeliveryFee({'shipping_rule' : name })
                                                }}
                                                />
                                            }
                                            slotSuffix={<span className="text-gray-900  font-bold">฿{shipping_amount.toLocaleString()}</span>}
                                            className={classNames('w-full !gap-0 border rounded-xl border-neutral-100 !p-4  bg-neutral-50 font-bold', {'outline outline-[1px]': checkedState == name})}
                                            >
                                            {name}
                                            </SfListItem>
                                        )) }
                                    </div>
                                </AddressDrawer>
                                </>
                                ) : (
                                    <div className='flex flex-col gap-y-2'>
                                        <Skeleton className='h-5 w-[100px]'/>
                                        <Skeleton className='h-[118px] w-full'/>
                                    </div>
                                )}
                                {cartContents.hasGiftItem && (
                                    <label className="w-full">
                                        <span className="pb-1 text-base text-neutral-900 font-body">Select Branch for Redemption</span>
                                        <BranchSelect
                                            name="branch"
                                            onChange={formik.handleChange}
                                            value={formik.values.branch}
                                            error={formik.errors.branch}
                                        />
                                    </label>
                                )}
                            {!shippingRuleLoading && addressList ? (
                                <>
                                    <PaymentMethods onChange={value => formik.setFieldValue('payment_method', value)} value={formik.values.payment_method} error={formik.errors.payment_method} />
                                    <div className='lg:hidden'>
                                        <CheckoutDetails addCoupon={<CouponForm />}/>
                                    </div>
                                    <div className='w-full pt-[11px] lg:pt-0'>
                                        <SfButton size="lg" className="w-full btn-primary text-base h-[50px] rounded-xl" onClick={formik.handleSubmit} disabled={formik.values.billing_address === undefined || formik.values.payment_method === undefined || checkedState === "" || undefined}>
                                            ชำระเงิน
                                        </SfButton>
                                        <div className="mt-3 text-sm text-secgray">
                                            เมื่อคลิก 'ชำระเงิน' คุณยินยอมให้ทำการชำระเงินตาม <SfLink href="#" className='text-linkblack no-underline'>นโยบายความเป็นส่วนตัว</SfLink> และ<SfLink href="#" className='text-linkblack no-underline'>เงื่อนไขการให้บริการของทางร้าน</SfLink>
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-center h-10 items-center'>
                                        <button className='flex items-center gap-x-2 text-base font-semibold'>
                                            <Icons.messageQuestionCircle />
                                            ขอความช่วยเหลือ
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <div className='flex flex-col gap-y-2 mb-10'>
                                        <Skeleton className='h-5 w-[100px]'/>
                                        <div className='flex gap-x-4'>
                                            <Skeleton className='h-[58px] w-full'/>
                                            <Skeleton className='h-[58px] w-full'/>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-y-2'>
                                        <Skeleton className='h-[50px] w-full'/>
                                        <Skeleton className='h-4 w-full'/>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='flex flex-col gap-y-8'>
                            <Skeleton className='h-4 w-[300px]'/>
                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-12 w-full mt-6'/>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </main>
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
                {data?.message?.map(({ name: nameVal, address_title, address_line1 = null, address_line2 = null, city, state, country, phone }) => (
                    <label key={nameVal} className="relative xs:w-full md:w-auto" onClick={() => handleSelect(nameVal)}>
                        <div className={`cursor-pointer rounded-xl -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 bg-neutral-50`}>
                            <AddressCard title={address_title} addressLine1={address_line1} addressLine2={address_line2} city={city} state={state === "Select One" ? null : state} country={country} phone={phone} active={value === nameVal}/>
                        </div>
                    </label>
                )).slice(0, limit || data?.message?.length)}
            </div>
            {error && <p className="text-red-500 mt-3 text-base">Please select an address</p>}
        </>
    );
}