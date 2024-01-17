import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { SfButton, SfLoaderCircular } from "@storefront-ui/react";
import { useProducts } from "../hooks/useProducts";
import { month } from "../data/month";
import AddressCard from "../components/AddressCard";
import MyAccountSection from "../components/MyAccountSection";
import { Skeleton } from "../components/Skeleton";

function SingleorderHistory() {
    const id = useParams().id;
    const {getOrderByOrderCode, Order} = useOrder();
    const {getByItemCode, products} = useProducts();
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState({})
    const [itemsList, setItemsList] = useState([])
    const [adressParts, setAdress] = useState([])

    const orderDetails = [
        {title:'Order ID:',value:order.name},
        {title:'Order Status:',value:order.status},
        {title:'Order Total:',value:`฿${order.base_total}`},
        {title:'Order Date:',value:`${new Date(order.creation).getDate()} ${month[new Date(order.creation).getMonth()]}, ${new Date(order.creation).getHours()}:${new Date(order.creation).getMinutes() < 10 ? '0' + new Date(order.creation).getMinutes(): new Date(order.creation).getMinutes()}`},
        {title:'Shipping Phone:',value:order.custom_phone_number}
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

    const PurchasedList = ({name, company, status, creation, image, price}) => {
        return (
          <div className="w-full flex gap-x-4">
              {image ? <img src={image} className="w-24 h-32"/> : <SfThumbnail size="lg" className="bg-gray-100 h-32 w-24"/>}
              <div className="flex flex-col gap-y-1 w-full">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-sm">{name}</h2>
                  <p className="text-sm font-medium">{price}</p>
                </div>
              </div>
          </div>
        )
      }

    useEffect(() => {
        if(Order.length > 0){
            if(products.length > 0){
                const temp = getOrderByOrderCode(id)
                setOrder(temp)
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
                    <h2 className="text-base font-bold text-primary">Order Details</h2>
                    <div className="flex flex-col gap-y-2">
                        {!loading ? (
                            <>
                                {orderDetails.map(detail => (
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-sm">{detail.title}</h3>
                                        <p className="text-sm">{detail.value ? detail.value : '-'}</p>
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
                    <h2 className="text-base font-bold text-primary">Shipping Details</h2>
                    <div className="flex flex-col gap-y-4">
                        {adressParts.length > 0 ? (
                            <AddressCard title={adressParts[0]} addressLine2={adressParts[1]}  city={adressParts[2]} state={adressParts[3]} country={adressParts[4]} />
                        ) : (
                            <Skeleton className='h-24 w-full'/>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-y-4">
                    <h2 className="text-base font-bold text-primary">Purchased items</h2>
                    <div className="grid grid-cols-1 gap-4 place-items-center">
                        {!loading ? itemsList.map(product => (
                            <PurchasedList name={product.web_item_name} image={product.website_image ? product.website_image : "https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/sneakers.png"} price={product.formatted_price}/>
                        )): (itemsList.map(p => (
                                <div className='flex justify-between w-full'>
                                    <div className='flex gap-x-2'>
                                    <Skeleton className='h-32 w-24'/>
                                    <Skeleton className='h-4 w-[200px]'/>
                                    </div>
                                    <Skeleton className='h-4 w-16'/>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="flex justify-center gap-x-2">
                    <SfButton variant='tertiary' className="btn-primary">
                        Contact us
                    </SfButton>
                    <SfButton variant='tertiary' className="btn-secondary">
                        Cancel order
                    </SfButton>
                </div>
            </div>
        </MyAccountSection>
    );
}

export default SingleorderHistory;