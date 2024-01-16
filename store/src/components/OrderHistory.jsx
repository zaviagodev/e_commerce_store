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
        <h1 className="primary-heading">Recent Order History</h1>
        <div className="flex flex-col gap-4">
        <table>
            <thead>
            <tr>
                <th>Order No.</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {!loading ? Order.slice(0, 3).map(({name, status, base_total, company, items, creation}) => {
                return (
                    // <div key={name} className="grid grid-cols-4 w-full">
                    //   <div className="grid grid-cols-5 col-span-3 gap-x-2">
                    //     <SfThumbnail size="lg" className="bg-gray-100"/>
                    //     <div className="col-span-4">
                    //         <h2 className="font-bold">{name}-{}{company}</h2>
                    //         <p>{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }  `}</p>
                    //         <p>{status}</p>
                    //     </div>
                    //   </div>
                    //   <span className="text-right">฿{base_total}</span>
                    // </div>
                    <tr key={name}>
                        <td>{name}-{}{company}</td>
                        <td>{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }  `}</td>
                        <td>{status}</td>
                        <td>฿{base_total}</td>
                        <td>
                        <Link>View Details</Link>
                        </td>
                    </tr>
                )}) : <SfLoaderCircular/>}
            </tbody>
        </table>
            
        </div>
            <Link to='/order-history'><SfButton href="#"  variant="tertiary" className="btn-primary">View History</SfButton></Link>
        </div> 
    );
}

export default OrderHistory;