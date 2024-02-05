import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { SfButton, SfLoaderCircular } from "@storefront-ui/react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import AddressCard from "../components/AddressCard";
import MyAccountSection from "../components/MyAccountSection";
import { Skeleton } from "../components/Skeleton";
import { useSetting } from "../hooks/useWebsiteSettings";
import { useFrappePostCall } from "frappe-react-sdk";
import { Icons } from "../components/icons";
import { useFrappeGetCall } from 'frappe-react-sdk';

function SingleorderHistory(randomKey = 0) {
    const id = useParams().id;
    const {getOrderByOrderCode, Order} = useOrder();
    const {defaultTaxe} = useSetting()
    const {getByItemCode, products, settingPage, isLoading:isProductLoading} = useProducts();
    const { cart, cartCount, getTotal, resetCart, loading:cartLoading } = useCart();
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState({})
    const [itemsList, setItemsList] = useState([])
    const [adressParts, setAdress] = useState([])
    const { data } = useFrappeGetCall('e_commerce_store.api.get_addresses', null, `addresses`)

    const {call : CheckPromoCode, error : codeError, result : codeResult, reset, isCompleted : PromoCompleted } = useFrappePostCall('webshop.webshop.shopping_cart.cart.apply_coupon_code');
    const {call : ApplyDeliveryFee, loading : deliveryLoading, result : deliveryResult, error : deliveryError} = useFrappePostCall('webshop.webshop.shopping_cart.cart.apply_shipping_rule');

    const orderDetails = [
        {title:'เลขที่คำสั่งซื้อ',value:order.name},
        {title:'ยอดรวมทั้งสิ้น',value:`฿${order.grand_total?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`},
        {title:'วันที่',value:`${new Date(order.creation).getDate()}/${new Date(order.creation).getMonth() + 1}/${new Date(order.creation).getFullYear()}`},
        {title:'สถานะ',value:order.status}
        // {title:'Shipping Phone:',value:order.custom_phone_number}
    ]

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
              {image ? <img src={image} className="min-w-[96px] h-24 object-cover fade-in"/> : <SfThumbnail size="lg" className="bg-gray-100 h-24 min-w-[96px]"/>}
              <div className="flex flex-col gap-y-1 w-full">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-col gap-y-1">
                    <h2>{name}</h2>
                    <p className="font-semibold">{qty} ชิ้น</p>
                  </div>
                  <p className="font-semibold">{price}</p>
                </div>
              </div>
          </div>
        )
      }

      const CheckoutDetails = () => {
        return (
            <div className='lg:ml-[98px]'>
            <div className='flex justify-between pt-[21px] border-t'>
                <div className="flex flex-col pr-2 gap-y-[21px]">
                    <p>ราคาสินค้าทั้งหมด</p>
                    <p className="text-maingray">ค่าจัดส่ง</p>
                    <p className='text-maingray'>
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
                    <p className='text-sm font-semibold'>{isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : deliveryResult?.message?.doc?.total ? `฿${deliveryResult?.message?.doc?.total?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : `฿${getTotal().toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</p>
                    <p className="text-maingray text-sm font-semibold">
                        {isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : deliveryResult?.message?.doc?.total_taxes_and_charges ? `฿${deliveryResult?.message?.doc?.total_taxes_and_charges?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "฿0"}
                    </p>
                    <p className='text-sm text-maingray'>-</p>
                </div>
            </div>
            <div className="flex justify-between typography-headline-4 md:typography-headline-3 py-4 lg:pt-4 border-t mt-4 font-medium">
                <p>ยอดรวมทั้งสิ้น</p>
                <p className="text-sm">{isProductLoading ? <Skeleton className='h-4 w-[100px]'/> : typeof codeResult?.message?.doc?.grand_total == 'undefined' ? deliveryResult?.message?.doc?.grand_total ? `฿ ${deliveryResult?.message?.doc?.grand_total?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : 'Your address is not supported' : `฿ ${codeResult?.message?.doc?.grand_total?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</p>
            </div>
        </div>
        )
    }

    useEffect(() => {
        if(Order.length > 0){
            if(products.length > 0){
                const temp = getOrderByOrderCode(id)
                setOrder(temp)
                // console.log(temp);
                setItemsList([]);
                temp.items.forEach((item) => {
                    setItemsList((prev) => [...prev, getByItemCode(item.item_code)])
                })
                setLoading(false)
            }
        }
        if(adressParts.length === 0 && order.address_display){
            setAdress(order.address_display.split('<br>'))
        }
    }, [Order, products,order])

    return (  
        <MyAccountSection>
            <div className="flex flex-col gap-y-8">
                <div className="flex flex-col gap-y-4">
                    <h2 className='font-semibold text-darkgray'>รายละเอียดคำสั่งซื้อ</h2>
                    <div className="flex flex-col gap-y-2">
                        {!loading ? (
                            <>
                                {orderDetails.map(detail => (
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm">{detail.title}</h3>
                                        <p className="text-sm font-semibold">{detail.value ? detail.value : '-'}</p>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {orderDetails.map(d => (
                                    <div className="flex items-center justify-between">
                                        <Skeleton className='h-4 w-[200px]'/>
                                        <Skeleton className='h-4 w-[200px]'/>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-y-4">
                    <h2 className='font-semibold text-darkgray'>วิธีการชำระเงิน</h2>
                    <div className="flex items-center gap-3 lg:justify-between">
                        <div className="border border-neutral-100 bg-neutral-50 rounded-xl h-[50px] w-full lg:w-1/2 px-4 flex items-center font-semibold">
                            QR พร้อมเพย์
                        </div>
                        <SfButton className="btn-primary rounded-xl h-[50px] whitespace-pre" variant="tertiary">
                            ชำระเงิน
                        </SfButton>
                    </div>
                </div>
                <div className="flex flex-col gap-y-4">
                    <h2 className='font-semibold text-darkgray'>ที่อยู่ในการจัดส่ง</h2>
                    <div className="flex flex-col gap-y-4">

                        {data?.message.length > 0 ? (
                        data.message
                            .filter((addressz) => addressz?.name === order.shipping_address_name)
                            .map((address, index) => (
                                <AddressCard
                                    title={address.address_title}
                                    addressLine1={address.address_line1}
                                    city={address.city}
                                    state={address.state === "Select One" ? null : address.state}
                                    postcode={address.pincode}
                                    country={address.country}
                                    phone={address.phone}
                                />
                            ))
                        ) : (
                        <Skeleton className='h-24 w-full' />
                        )}   
                    </div>
                </div>
                <div className="flex flex-col gap-y-4">
                    <h2 className='font-semibold text-darkgray'>รายละเอียดสินค้า</h2>
                    <div className="grid grid-cols-1 gap-4 place-items-center">
                        {itemsList.length > 0 ? itemsList.map((product, index) => (
                            <PurchasedList qty={order.items[index].qty} name={product.web_item_name} image={product.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`} price={product.formatted_price}/>
                        )): itemsList.map(p => (
                                <div className='flex justify-between w-full'>
                                    <div className='flex gap-x-2'>
                                    <Skeleton className='h-24 w-24'/>
                                    <Skeleton className='h-4 w-[200px]'/>
                                    </div>
                                    <Skeleton className='h-4 w-16'/>
                                </div>
                            ))
                        }
                    </div>
                </div>
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