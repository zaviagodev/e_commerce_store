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
    <Link to={`/order-history/${name}`} key={name} className="grid grid-cols-auto">
        <SfThumbnail size="lg"  className="bg-gray-100"/>
        <div>
          <h2 className="font-bold">{name}-{}{company}</h2>
          <p>{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }  `}</p>
          <p>{status}</p>
        </div>
        <span>{base_total}</span>
    </Link>
)
}
)
: <SfLoaderCircular/>}

        </div>
    );
}

export default OrderHistory;