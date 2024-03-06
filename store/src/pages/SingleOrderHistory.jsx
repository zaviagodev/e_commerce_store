import { Link, useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { SfButton, SfLoaderCircular,SfSelect, SfThumbnail  } from "@storefront-ui/react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import AddressCard from "../components/AddressCard";
import MyAccountSection from "../components/MyAccountSection";
import { Skeleton } from "../components/Skeleton";
import { useSetting } from "../hooks/useWebsiteSettings";
import { useFrappePostCall } from "frappe-react-sdk";
import { Icons } from "../components/icons";
import { useFrappeGetCall } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom';
import { orderStatuses } from "../data/orderStatuses";

function SingleorderHistory(randomKey = 0) {
    const id = useParams().id;
    const {getOrderByOrderCode, Order} = useOrder();
    const {defaultTaxe,paymentmethods} = useSetting()
    const {getByItemCode, products, settingPage, allItemsLoading:isProductLoading} = useProducts();
    const { cart, cartCount, getTotal, resetCart, loading:cartLoading } = useCart();
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState({})
    const [selectedmethod, setSelectedMethod] = useState({})
    const [itemsList, setItemsList] = useState([])
    const [addressParts, setAddress] = useState([])
    const { data } = useFrappeGetCall('e_commerce_store.api.get_addresses', null, `addresses`)
    const day = (creation) => new Date(creation).getDate()
    const month = (creation) => new Date(creation).getMonth() + 1
    const navigate = useNavigate();

    const {call : CheckPromoCode, error : codeError, result : codeResult, reset, isCompleted : PromoCompleted } = useFrappePostCall('webshop.webshop.shopping_cart.cart.apply_coupon_code');
    const {call : ApplyDeliveryFee, loading : deliveryLoading, result : deliveryResult, error : deliveryError} = useFrappePostCall('webshop.webshop.shopping_cart.cart.apply_shipping_rule');
    const {call : UpdatePaymentMethod} = useFrappePostCall('webshop.webshop.api.changepaymentmethod');

    const orderDetails = [
        {title:'เลขที่คำสั่งซื้อ',value:order.name},
        {title:'ยอดรวมทั้งสิ้น',value:`฿ ${order.grand_total?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`},
        {title:'วันที่',value:`${day(order.creation) < 10 ? "0" + day(order.creation) : day(order.creation)}/${month(order.creation) < 10 ? "0" + month(order.creation) : month(order.creation)}/${new Date(order.creation).getFullYear()}`},
        {title:'สถานะ',value:orderStatuses?.find(stat => stat.value == order.status)?.label}
        // {title:'Shipping Phone:',value:order.custom_phone_number}
    ]

    const gotopaymentpage = async() => {
        navigate(`/payment?order_id=${order.name}&amount=${order.grand_total}&payment_method=${selectedmethod}`) // order.custom_payment_method was replaced with selectedmethod due to the test of the 'make a payment' button
    };

    const onpaymentchange = async(paymentid) => {
        setSelectedMethod(paymentid);
        UpdatePaymentMethod({"invoiceno":order.name,"paymentid":paymentid});
    };

    /* 
        key={product.item_code}
        title={product.web_item_name}
        productId={product.name}
        itemCode={product.item_code}
        salesPrice={product.formatted_mrp}
        price={product.formatted_price}
        thumbnail={product.website_image ? product.website_image : "https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/sneakers.png"}
        isGift={product?.item_group === "Gift" || product?.item_group === "Gift and Cards"}
    */

    const PurchasedList = ({name, company, status, creation, image, price, qty}) => {
        return (
          <div className="w-full flex gap-x-4">
              {image ? <img src={image} className="min-w-[53px] h-[53px] object-cover fade-in"/> : <SfThumbnail size="lg" className="bg-gray-100 h-[53px] min-w-[53px]"/>}
              <div className="flex flex-col gap-y-1 w-full">
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col gap-y-1 w-[60%]">
                    <h2>{name}</h2>
                    <p className="font-semibold">{qty} ชิ้น</p>
                  </div>
                  <p className="font-semibold whitespace-pre">{price}</p>
                </div>
              </div>
          </div>
        )
      }

      const CheckoutDetails = () => {
        return (
            <div className='lg:ml-[69px]'>
            <div className='flex justify-between pt-[21px] border-t'>
                <div className="flex flex-col pr-2 gap-y-[21px]">
                    <p className="text-sm">ราคาสินค้าทั้งหมด</p>
                    <p className="text-maingray text-sm">ค่าจัดส่ง</p>
                    <p className='text-maingray text-sm'>
                    ภาษีมูลค่าเพิ่ม
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
                    <p className='text-sm font-semibold'>{isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : `฿ ${order.base_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</p>
                    <p className="text-maingray text-sm font-semibold">
                    {isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : `฿ ${order.tax_amount?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                    </p>
                    <p className='text-sm text-maingray font-semibold'>-</p>
                </div>
            </div>
            <div className="flex justify-between typography-headline-4 md:typography-headline-3 py-4 lg:pt-4 border-t mt-4 font-medium">
                <p className="text-sm">ยอดรวมทั้งสิ้น</p>
                <p className="text-sm font-semibold">{isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : `฿ ${order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</p>
            </div>
        </div>
        )
    }

    useEffect(() => {
        if(Order.length > 0){
            if(products.length > 0 && isProductLoading === false){
                const temp = getOrderByOrderCode(id)
                setOrder(temp)
                setSelectedMethod(temp.custom_payment_method)
                setItemsList([]);
                temp.items.forEach((item) => {
                    setItemsList((prev) => [...prev, getByItemCode(item.item_code)])
                })
                setLoading(false)
            }
        }
        if(addressParts.length === 0 && order.address_display){
            setAddress(order.address_display.split('<br>'))
        }
    }, [Order, products,order, isProductLoading, addressParts.length, getByItemCode, getOrderByOrderCode, id])

    return (  
        <MyAccountSection>
            <div className="flex flex-col gap-y-8">
                <div className="flex flex-col gap-y-10">
                    <div className="flex items-center gap-[10px]">
                        <Link to='/order-history'>
                            <Icons.flipBackward color="#A9A9A9"/>
                        </Link>
                        <h2 className='font-semibold text-darkgray'>รายละเอียดคำสั่งซื้อ</h2>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        {!loading ? (
                            <>
                                {orderDetails?.map(detail => (
                                    <div key={detail.title} className="flex items-center justify-between">
                                        <h3 className="text-sm text-secgray">{detail.title}</h3>
                                        <p className="text-sm font-semibold">{detail.value ? detail.value : '-'}</p>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {orderDetails?.map(d => (
                                    <div key={d.title} className="flex items-center justify-between">
                                        <Skeleton className='h-4 w-[100px]'/>
                                        <Skeleton className='h-4 w-[160px]'/>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                {!loading ? (
                    <>{order.status === 'Cancelled' || order.status === 'Overdue' ? null : (
                        <div className="flex flex-col gap-y-2">
                            <h2 className='font-semibold text-darkgray'>วิธีการชำระเงิน</h2>
                            <div className="flex items-center gap-3 lg:justify-between">
                                {order.status === "Paid" ? (
                                    <div className="border border-neutral-100 bg-neutral-50 rounded-xl h-[50px] w-full lg:w-1/2 px-4 flex items-center font-semibold">
                                        {paymentmethods?.find(method => method.key == order.custom_payment_method)?.name}
                                    </div>
                                ) : (
                                    <SfSelect className='!p-0 !ring-0 w-full m-auto' wrapperClassName="border border-neutral-100 bg-neutral-50 rounded-xl h-[50px] w-full lg:w-1/2 px-4 flex items-center font-semibold" size="base" value={selectedmethod} onChange={(e) => onpaymentchange(e.target.value)}>
                                        {paymentmethods?.map((method) => (
                                            <option value={method.key} key={method.key}>{method.name}</option>
                                        ))}
                                    </SfSelect>
                                )}
                                {order.status === "Unpaid" && (
                                    <SfButton className="btn-primary rounded-xl h-[50px] whitespace-pre" variant="tertiary" onClick={gotopaymentpage}>
                                        ชำระเงิน
                                    </SfButton>
                                )}
                            </div>
                        </div>
                    )}</>
                ) : (
                    <div className="flex items-center justify-between">
                        <Skeleton className='h-4 w-[100px]'/>
                        <Skeleton className='h-4 w-[160px]'/>
                    </div>
                )}
                {!loading ? (
                    <div className="flex flex-col gap-y-2">
                        {data?.message?.filter((addressz) => addressz?.name === order.shipping_address_name).length > 0 ? <h2 className='font-semibold text-darkgray'>ที่อยู่จัดส่ง</h2> : null}
                        <div className="flex flex-col gap-y-4">

                            {data?.message?.filter((addressz) => addressz?.name === order.shipping_address_name).length > 0 && (
                            data.message
                                .filter((addressz) => addressz?.name === order.shipping_address_name)
                                .map((address, index) => (
                                    <AddressCard
                                        key={index}
                                        title={address.address_title}
                                        addressLine1={address.address_line1}
                                        city={address.city}
                                        state={address.state === "Select One" ? null : address.state}
                                        postcode={address.pincode}
                                        country={address.country}
                                        phone={address.phone}
                                        deletebtn={false}
                                        active={true}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <Skeleton className='h-24 w-full' />
                )}
                {!loading ? (
                    <div className="flex flex-col gap-y-4">
                        {itemsList.length > 0 ? <h2 className='font-semibold text-darkgray'>รายละเอียดสินค้า</h2> : null}
                        <div className="grid grid-cols-1 gap-4 place-items-center">
                            {itemsList.length > 0 && !isProductLoading ? itemsList?.map((product, index) => (
                                <PurchasedList key={index} qty={order.items[index].qty} name={product?.web_item_name} image={product?.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product?.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`} price={product?.formatted_price}/>
                            )) : null}
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-between mb-4'>
                        <div className='flex gap-x-2'>
                            <Skeleton className='h-[53px] w-[53px]'/>
                            <Skeleton className='h-4 w-[100px]'/>
                        </div>
                        <Skeleton className='h-4 w-[100px]'/>
                    </div>
                )}
                <CheckoutDetails />
                <div className="flex justify-center gap-x-10 mt-2">
                    <button className='flex items-center gap-x-2 text-base font-semibold'>
                        <Icons.messageQuestionCircle />
                        ขอความช่วยเหลือ
                    </button>
                    <button className='flex items-center gap-x-2 text-base font-semibold'>
                        <Icons.download01 />
                        ดาวน์โหลดใบเสร็จ
                    </button>
                </div>
            </div>
        </MyAccountSection>
    );
}

export default SingleorderHistory;