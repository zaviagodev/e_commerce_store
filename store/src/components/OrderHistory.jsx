import { useOrder } from "../hooks/useOrders";
import { SfThumbnail, SfButton } from "@storefront-ui/react";


const item = [{
    name: "name",
    status: "status",
    base_total: 300,
    company: "company",
    items: [{
        "item_code": "item_code",
        "item_name": "item_name",
        "qty": "qty",
        "rate": "rate",
        "amount": "amount"
    }],
    creation: "2023-12-24 18:09:28.692383"

}]
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
    const {order} = useOrder();
    return ( 
        <div  className="flex flex-col gap-8 py-4 px-2">
        <h1>Recent Order History</h1>
        <div className="flex flec-col gap-4">
            {item.map(({name, status, base_total, company, items, creation}) => {

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
            )}
        </div>
        <SfButton variant="tertiary">View History</SfButton>
        </div> 
    );
}

export default OrderHistory;