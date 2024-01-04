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
    }, [Order, products])

    return (  
        <div>
            <h1>Order Details</h1>
            <div>
                <p>Order Code: {order.name}</p>
                <p>Order Status: {order.status}</p>
                <p>Order Total: {order.base_total}</p>
                <p>Order Date: {`${new Date(order.creation).getDate()} ${month[new Date(order.creation).getMonth()]}, ${new Date(order.creation).getHours()}:${new Date(order.creation).getMinutes() < 10 ? '0' + new Date(order.creation).getMinutes(): new Date(order.creation).getMinutes() }  `}</p>
            </div>
            <h2>Shipping Details</h2>
            {order.address_display}
            <AddressCard title={order.shipping_address} addressLine2={order.shipping_country} city={order.shipping_city} state={order.shipping_pincode} country={order.shipping_country} ></AddressCard>
            <div>
                <p>Shipping Phone: {order.custom_phone_number}</p>
            </div>
            <h2>Purchased items</h2>
            <div>
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
    );
}

export default SingleorderHistory;