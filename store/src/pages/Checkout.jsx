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

    const { call: updatecart, isCompleted: cartupdated  } = useFrappePostCall('webshop.webshop.api.update_cart');



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
      const { cart, cartCount, getTotal, resetCart } = useCart();


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
                {errorAlert && (<p className="text-sm text-negative-600">{errorAlert}</p>)}
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

    return (
        <main className='main-section-small'>
            <div className='grid grid-cols-1 lg:grid-cols-2 justify-center gap-x-10'>
                <div className='w-full py-5 pr-10'>
              
                

                
                    <div className={`${showOrderSum ? 'block' : 'hidden'} lg:!block lg:px-5`}>
                        <h1 className='text-[56px] font-bold pt-6 hidden lg:block leading-5'>{deliveryLoading  ? <Skeleton className='h-8 w-[100px]'/> : `฿ ${deliveryResult?.message?.doc?.base_grand_total}` }</h1>
                       {/*
                        <h1 className='text-[56px] font-bold pt-6 hidden lg:block leading-5'>{deliveryLoading  ? <Skeleton className='h-8 w-[100px]'/> : typeof codeResult?.message?.doc?.grand_total == 'undefined' ? `฿ ${codeResult?.message?.doc?.base_grand_total}` :`฿ ${deliveryResult?.message?.doc?.base_grand_total }`  }</h1>
                        */} 
                        
                        
                        <div className="flex flex-col typography-text-basesm pt-16 pb-6">
                            {cartCount > 0 ? (
                                <ul className='flex flex-col gap-y-4'>
                                    {Object.entries(cart).map(([itemCode]) => {
                                        const product = getByItemCode(itemCode)
                                        return (
                                        <li key={itemCode} className="flex pb-5">
                                            <div className="h-[53px] w-[53px] flex-shrink-0 overflow-hidden">
                                                <img src={`${import.meta.env.VITE_ERP_URL || ""}${product?.website_image}`} alt={product?.item_name} className="h-full w-full object-cover object-center" />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div className="flex justify-between text-basesm text-gray-900 font-medium">
                                                    <h3 className='text-texttag pr-8'>{product?.web_item_name}</h3>
                                                    <p className='whitespace-pre'>{product?.formatted_price}</p>
                                                </div>

                                                <div className="flex justify-between text-basesm text-maingray font-medium">
                                                    {cart[itemCode]} ชิ้น
                                                </div>
                                            </div>
                                        </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <div className='flex justify-between mb-4'>
                                    <div className='flex gap-x-2'>
                                        <Skeleton className='h-[53px] w-[53px]'/>
                                        <Skeleton className='h-4 w-[100px]'/>
                                    </div>
                                    <Skeleton className='h-4 w-[100px]'/>
                                </div>
                            )}
                            {deliveryLoading  ? (
                                <div className='flex justify-between lg:ml-[69px] pt-3 border-t'>
                                    <div className="flex flex-col gap-y-6 grow pr-2">
                                        <Skeleton className='h-4 w-[100px]'/>
                                        <Skeleton className='h-4 w-[100px]'/>
                                        <Skeleton className='h-4 w-[100px]'/>
                                    </div>
                                    <div className="flex flex-col gap-y-6">
                                        <Skeleton className='h-4 w-[100px]'/>
                                        <Skeleton className='h-4 w-[100px]'/>
                                        <Skeleton className='h-4 w-[100px]'/>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex justify-between lg:ml-[69px] pt-3 border-t'>
                                    <div className="flex flex-col grow pr-2">
                                        <p className='text-basesm'>ยอดรวมย่อย</p>
                                        <p className="my-4 text-maingray text-basesm">ค่าจัดส่ง</p>
                                        <p className='text-maingray text-basesm'>
                                        ภาษีสินค้า
                                        {`(${
                                            defaultTaxe?.rate !== 0 ? defaultTaxe?.rate+'%' : ''
                                        } + ${
                                            defaultTaxe?.amout !== 0 ? defaultTaxe?.amout+'฿' : ''
                                        })`}
                                        </p>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <p className='text-basesm'>{deliveryResult?.message?.doc?.total ? `฿${deliveryResult?.message?.doc?.total}` : `฿${getTotal()}`}</p>
                                        <p className="my-4 text-basesm text-maingray">
                                            {deliveryResult?.message?.doc?.total_taxes_and_charges ? `฿${deliveryResult?.message?.doc?.total_taxes_and_charges}` : "฿0"}
                                        </p>
                                        <p className='text-maingray text-basesm'></p>
                                    </div>
                                </div>
                            )}
                    </div>
                        <div className='lg:ml-[69px]'>
                            {!loading ? (codeResult ? (
                                <div className='flex flex-col gap-y-2'>
                                    <div className="flex items-center justify-between">
                                        <div className='bg-neutral-100 rounded-md p-[10px] flex items-center gap-x-2 text-base'>
                                            <p>{codeResult.message.coupon_code.toUpperCase()}</p>
                                            <SfButton size="sm" variant="tertiary" className='!p-0' onClick={removePromoCode}>
                                                <SfIconClose size='sm' className='text-maingray'/>
                                            </SfButton>
                                        </div>
                                        <p className='text-basesm'>{codeResult.message.coupon_code.toUpperCase()}</p>
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
                                            className='text-basesm'
                                        />
                                        <SfButton type="submit" className='btn-primary text-basesm'>
                                            Apply
                                        </SfButton>
                                    </div>
                                    <CouponAlert />
                                </form>
                            ) : (
                                <a className='text-secondary hover:underline cursor-pointer inline-block font-medium text-basesm' onClick={() => setAddPromo(true)}>ใส่คูปองส่วนลด</a>
                            )) : <Skeleton className='h-6 w-[100px]'/>} 
                            {/*<p className="px-3 py-1.5 bg-secondary-100 text-secondary-700 typography-text-base rounded-lg text-center mb-4">
                                You are saving ${Math.abs(orderDetails.savings).toFixed(2)} on your order today!
                            </p>*/ }
                            </div>
                            {deliveryLoading  ? (
                                <div className="flex justify-between typography-headline-4 md:typography-headline-3 py-4 lg:pt-4 lg:ml-[69px] border-y lg:border-b-0 mt-4 font-medium">
                                    <Skeleton className='h-4 w-[100px]'/>
                                    <Skeleton className='h-4 w-[100px]'/>
                                </div>
                            ) : (
                                <div className="flex justify-between typography-headline-4 md:typography-headline-3 py-4 lg:pt-4 lg:ml-[69px] border-y lg:border-b-0 mt-4 font-medium">
                                    <p className='text-basesm'>ยอดชำระเงินทั้งหมด</p>
                                    <p className='text-basesm'>{typeof codeResult?.message?.doc?.grand_total == 'undefined' ? `฿ ${deliveryResult?.message?.doc?.grand_total}` : `฿ ${codeResult?.message?.doc?.grand_total}`}</p>
                                </div>
                            )}
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
                <form className="w-full flex flex-col gap-10 text-neutral-900 p-[60px] pt-[7.75em] min-h-screen checkout-shadow">
                    {cartContents.hasNormalItem ? (
                        <>
                            {addressList?.message?.length > 0 ? (
                                <>
                                    <div className='w-full flex flex-col gap-y-2'>
                                        <label className="w-full">
                                            <legend className="mb-8 font-bold text-darkgray text-base">ข้อมูลการจัดส่ง</legend>
                                            <div className='flex flex-col gap-y-2'>
                                                <h2 className="font-medium text-basesm text-secgray">ที่อยู่*</h2>
                                                <div className='border rounded-lg bg-neutral-50 overflow-hidden'>
                                                    <a className='p-6 flex items-center justify-between w-full cursor-pointer' onClick={() => setMoreAddresses(true)}>
                                                        <div className='flex items-center gap-x-2'>
                                                            <Icons.marketPin04 color='#666666'/>
                                                            <span className='text-basesm font-medium text-darkgray'>เพิ่ม / เลือกที่อยู่การจัดส่ง</span>
                                                        </div>
                                                        <SfIconArrowForward />
                                                    </a>
                                                    {(formik.values.billing_address && !addNewAddress) && (
                                                        <>
                                                            <div className='p-6 pt-0'>
                                                                {addressList?.message?.filter(address => address.name === formik.values.billing_address).map(a => (
                                                                    <div className='flex flex-col'>
                                                                        <h2 className='font-semibold text-base mb-2'>{a.address_title}</h2>
                                                                        <p className='text-base'>{a.city}</p>
                                                                        <p className='text-base'>{a.state}</p>
                                                                        <p className='text-base'>{a.country}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className='h-3 w-full post-gradient'/>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
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
                                        <SfButton className='btn-primary w-full text-base mt-9 h-[50px]' variant='tertiary' onClick={handleAddNewAddress}>เพิ่มที่อยู่ใหม่</SfButton>
                                    </AddressDrawer>
                                </>
                            ) : <NewAddressForm />}
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
                                {!shippingRuleLoading ?
                                (<>
                                <label className='w-full'>
                                    <legend className="mb-2 font-medium text-basesm text-secgray">ตัวเลือกการจัดส่ง</legend>
                                    <div className='border rounded-lg bg-neutral-50 overflow-hidden'>
                                        <a className='p-6 flex items-center justify-between w-full cursor-pointer' onClick={() => setMorePayments(true)}>
                                            <div className='flex items-center gap-x-2'>
                                                <Icons.truck01 color='#595959'/>
                                                <span className='text-basesm font-medium text-darkgray'>เลือกวิธีการจัดส่งที่ต้องการ</span>
                                            </div>
                                            <SfIconArrowForward />
                                        </a>
                                        {checkedState && (
                                            <div className='p-6 pt-0'>
                                                <h2 className='font-semibold text-base'>{checkedState}</h2>
                                            </div>
                                        )}
                                    </div>
                                </label>
                                <AddressDrawer isOpen={morePayments} setIsOpen={setMorePayments} title='เลือกการจัดส่ง'>
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
                                                className='checked:bg-black !border border-primary flex hidden'
                                                onChange={() => {
                                                    setCheckedState(name);
                                                    formik.setFieldValue('shipping_method', name);
                                                    ApplyDeliveryFee({'shipping_rule' : name })
                                                }}
                                                />
                                            }
                                            slotSuffix={<span className="text-gray-900 text-basesm">฿{shipping_amount}</span>}
                                            className={classNames('w-full !gap-0 border rounded-lg border-neutral-200 !px-4 text-basesm bg-neutral-50', {'outline outline-[1px]': checkedState == name})}
                                            >
                                            {name}
                                            </SfListItem>
                                        )) }
                                    </div>
                                </AddressDrawer>
                                </>
                                ) : <SfLoaderCircular/>}
                                {cartContents.hasGiftItem && (
                                    <label className="w-full">
                                        <span className="pb-1 text-base font-medium text-neutral-900 font-body">Select Branch for Redemption</span>
                                        <BranchSelect
                                            name="branch"
                                            onChange={formik.handleChange}
                                            value={formik.values.branch}
                                            error={formik.errors.branch}
                                        />
                                    </label>
                                )}
                            <PaymentMethods onChange={value => formik.setFieldValue('payment_method', value)} value={formik.values.payment_method} error={formik.errors.payment_method} />
                            <div className='w-full'>
                                <SfButton size="lg" className="w-full btn-primary text-base h-[50px] rounded-lg" onClick={formik.handleSubmit}>
                                    ชำระเงิน
                                </SfButton>
                                <div className="mt-3 text-sm text-secgray">
                                    เมื่อคลิก 'ชำระเงิน' คุณยินยอมให้ทำการชำระเงินตาม <SfLink href="#" className='text-secondary no-underline'>นโยบายความเป็นส่วนตัว</SfLink> และ<SfLink href="#" className='text-secondary no-underline'>เงื่อนไขการให้บริการของทางร้าน</SfLink>
                                </div>
                            </div>
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

const AddressDrawer = ({isOpen, setIsOpen, children, title}) => {
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
                className="bg-neutral-50 z-99 md:w-[386px] w-full box-border"
            >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex items-center gap-x-[10px] p-4 border-b">
                            <div className="flex h-7 items-center">
                                <button onClick={() => setIsOpen(false)} type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Close panel</span>
                                    <Icons.flipBackward />
                                </button>
                            </div>
                            <h2 className="text-base font-medium text-gray-900 text-center whitespace-pre" id="slide-over-title">{title}</h2>
                        </div>
                        <div className="flow-root p-6">
                            {children}
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
                        <div className={`cursor-pointer rounded-lg -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 bg-neutral-50`}>
                            <AddressCard title={address_title} addressLine2={address_line2} city={city} state={state === "Select One" ? null : state} country={country} active={value === nameVal}/>
                        </div>
                    </label>
                )).slice(0, limit || data?.message?.length)}
            </div>
            {error && <p className="text-negative-600 mt-3 text-base font-medium">Please select an address</p>}
        </>
    );
}