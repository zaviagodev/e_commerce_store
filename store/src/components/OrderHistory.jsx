import { useEffect, useState } from "react";
import { useOrder } from "../hooks/useOrders";
import { SfThumbnail, SfButton, SfLoaderCircular } from "@storefront-ui/react";
import { Link } from "react-router-dom";
import { month } from "../data/month";


function OrderHistory() {
    const {Order} = useOrder();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (Order.length > 0) {
            setLoading(false)
        }
    }, [Order])
    
    return ( 
        <div  className="flex flex-col gap-8 py-4 px-2">
        <h1>Recent Order History</h1>
        <div className="flex flex-col gap-4">
            {!loading ? Order.slice(0, 3).map(({name, status, base_total, company, items, creation}) => {

                return (
                    <div key={name} className="grid grid-cols-8 grid-rows-3 grid-flow-row place-items-start">
                        <SfThumbnail size="lg"  className="col-span-1 row-span-1 row-start-1 col-start-1 "/>
                        <h2 className="col-span-6 row-span-1">{name}-{}{company}</h2>
                        <p className="col-span-6 row-span-1 col-start-2 ">{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }  `}</p>
                        <p className="row-span-1 col-span-1 row-start-3 col-start-2">{status}</p>
                        <span className="col-span-1 row-span-1 row-start-1 col-start-8">{base_total}</span>
                    </div>
                )
                }
            )
            : <SfLoaderCircular/>}
        </div>
            <Link to='/order-history'><SfButton href="#"  variant="tertiary">View History</SfButton></Link>
        </div> 
    );
}

export default OrderHistory;