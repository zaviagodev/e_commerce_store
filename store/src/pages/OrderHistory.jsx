import { useOrder } from "../hooks/useOrders";
import { useState, useEffect } from "react";
import { SfThumbnail, SfLoaderCircular, SfSelect } from "@storefront-ui/react";
import { Link } from "react-router-dom";
import MyAccountSection from "../components/MyAccountSection";

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
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [statusOptions, setStatusOptions] = useState(['All'])
    const showList = [5, 10, 20, 50, 100, 'All']
    const [selectedShow, setSelectedShow] = useState()

    useEffect(() => {
        if (Order.length > 0) {
            setLoading(false)
        }
        const uniqueStatuses = Array.from(new Set(Order.map(item => item.status)));
        setStatusOptions(['All', ...uniqueStatuses]);
    }, [Order])

    const filteredData = selectedStatus === 'All'
    ? Order
    : Order.filter(item => item.status === selectedStatus);

    return (
        <MyAccountSection>
            <h1 className="primary-heading text-primary mb-8">Order history</h1>
            <div className="flex flex-col gap-y-4">
              <div className="flex border-b">
                {statusOptions.map(option => (
                    <button onClick={() => setSelectedStatus(option)} key={option} className={`px-4 py-2 border-b-2 ${selectedStatus === option ? 'border-b-black' : 'border-b-white'}`}>{option}</button>
                ))}
            </div>
            <div className="flex items-center gap-x-2">
                    <label className="typography-text-sm font-medium">Show</label>
                    <SfSelect name="state" placeholder="-- Select --" onChange={(e) => setSelectedShow(e.target.value)}>
                        {showList.map((list, index) => (
                            <option key={index} value={list === 'All' ? filteredData.length : list}>{list === 'All' ? 'All orders' : `Last ${list} orders`}</option>
                        ))}
                    </SfSelect>
                </div>
            {!loading ? filteredData.slice(0, selectedShow).map(({name, status, base_total, company, items, creation}) => (
                <Link to={`/order-history/${name}`} key={name} className="grid grid-cols-5">
                    <div className="grid grid-cols-5 gap-2 col-span-3">
                    <SfThumbnail size="lg" className="bg-gray-100"/>
                    <div className="col-span-4">
                        <h2 className="font-bold">{name}-{}{company}</h2>
                        <p>{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }  `}</p>
                    </div>
                    </div>
                    <p>{status}</p>
                    <span className="text-right">฿{base_total}</span>
                </Link>
            ))  : <SfLoaderCircular/>}
                </div>
        </MyAccountSection>
        // <main className="main-section">
        //     <h1 className="mb-8 primary-heading text-primary text-center">Order history</h1>
        //     <section className="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">
        //         <div className="col-span-1">
        //             <label className="typography-text-sm font-medium mb-2 block">Show</label>
        //             <SfSelect name="state" placeholder="-- Select --" onChange={(e) => setSelectedShow(e.target.value)}>
        //                 {showList.map((list, index) => (
        //                     <option key={index} value={list === 'All' ? filteredData.length : list}>{list === 'All' ? 'All orders' : `Last ${list} orders`}</option>
        //                 ))}
        //             </SfSelect>
        //         </div>
        //         <div className="col-span-2 flex flex-col gap-y-4">
        //             <div className="flex border-b">
        //                 {statusOptions.map(option => (
        //                     <button onClick={() => setSelectedStatus(option)} key={option} className={`px-4 py-2 border-b-2 ${selectedStatus === option ? 'border-b-black' : 'border-b-white'}`}>{option}</button>
        //                 ))}
        //             </div>
        //             {!loading ? filteredData.slice(0, selectedShow).map(({name, status, base_total, company, items, creation}) => (
        //                 <Link to={`/order-history/${name}`} key={name} className="grid grid-cols-5">
        //                   <div className="grid grid-cols-5 gap-2 col-span-3">
        //                     <SfThumbnail size="lg" className="bg-gray-100"/>
        //                     <div className="col-span-4">
        //                       <h2 className="font-bold">{name}-{}{company}</h2>
        //                       <p>{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }  `}</p>
        //                     </div>
        //                   </div>
        //                   <p>{status}</p>
        //                   <span className="text-right">฿{base_total}</span>
        //                 </Link>
        //             ))  : <SfLoaderCircular/>}
        //         </div>
        //     </section>
        // </main>
    );
}

export default OrderHistory;