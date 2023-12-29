import { useOrder } from "../hooks/useOrders";
import { useState, useEffect } from "react";
import { SfThumbnail, SfLoaderCircular } from "@storefront-ui/react";
import { Link } from "react-router-dom";




const month = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug",
    8: "Sept",
    9: "Oct",
    10: "Nov",
    11: "Dec"
}


function OrderHistory() {
    const {Order} = useOrder();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (Order.length > 0) {
            setLoading(false)
        }
    }, [Order])


    return (
        <div>
            {!loading ? Order.map(({name, status, base_total, company, items, creation}) => {

return (
    <Link to={`/order-history/${name}`} key={name} className="grid grid-cols-8 grid-rows-3 grid-flow-row place-items-start">
        <SfThumbnail size="lg"  className="col-span-1 row-span-1 row-start-1 col-start-1 "/>
        <h2 className="col-span-6 row-span-1">{name}-{}{company}</h2>
        <p className="col-span-6 row-span-1 col-start-2 ">{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }  `}</p>
        <p className="row-span-1 col-span-1 row-start-3 col-start-2">{status}</p>
        <span className="col-span-1 row-span-1 row-start-1 col-start-8">{base_total}</span>
    </Link>
)
}
)
: <SfLoaderCircular/>}

        </div>
     );
}

export default OrderHistory;