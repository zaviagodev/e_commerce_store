import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { SfLoaderCircular } from "@storefront-ui/react";
import { useProducts } from "../hooks/useProducts";
import { month } from "../data/month";
import AddressCard from "../components/AddressCard";

function SingleorderHistory() {
    const id = useParams().id;
    const {getOrderByOrderCode, Order} = useOrder();
    const {getByItemCode, products} = useProducts();
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState({})
    const [itemsList, setItemsList] = useState([])
    const [adressParts, setAdress] = useState([])

    const orderDetails = [
        {title:'Order Code:',value:order.name},
        {title:'Order Status:',value:order.status},
        {title:'Order Total:',value:order.base_total},
        {title:'Order Date:',value:`${new Date(order.creation).getDate()} ${month[new Date(order.creation).getMonth()]}, ${new Date(order.creation).getHours()}:${new Date(order.creation).getMinutes() < 10 ? '0' + new Date(order.creation).getMinutes(): new Date(order.creation).getMinutes()}`},
        {title:'Shipping Phone:',value:order.custom_phone_number}
    ]

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
        <main className="main-section flex flex-col gap-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">
                <div className="col-span-1 flex flex-col gap-y-8">
                    <h1 className="primary-heading text-primary">Order Details</h1>
                    <div className="flex flex-col gap-y-2">
                        {orderDetails.map(detail => (
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{detail.title}</h3>
                                <p>{detail.value ? detail.value : '-'}</p>
                            </div>
                        ))}
                    </div>
                    <h3 className="primary-heading text-primary">Shipping Details</h3>
                    <div className="flex flex-col gap-y-4">
                        <AddressCard title={adressParts[0]} addressLine2={adressParts[1]}  city={adressParts[2]} state={adressParts[3]} country={adressParts[4]} />
                    </div>
                </div>
                <div className="col-span-2">
                    <h2 className="primary-heading text-primary mb-8">Purchased items</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
                        {!loading ? itemsList.map((product) => (
                        <ProductCard
                        key={product.item_code}
                        title={product.web_item_name}
                        productId={product.name}
                        itemCode={product.item_code}
                        salesPrice={product.formatted_mrp}
                        price={product.formatted_price}
                        thumbnail={product.website_image ? product.website_image : "https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/sneakers.png"}
                        isGift={product?.item_group === "Gift" || product?.item_group === "Gift and Cards"}
                    />
                        )): <SfLoaderCircular />}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SingleorderHistory;