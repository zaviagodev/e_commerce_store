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

    const OrderList = ({name, company, status, creation, total, image}) => {
      // const data = [
      //   { title:'Order No.', info:<>{name}-{}{company}</>},
      //   { title:'Date', info:`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }`},
      //   { title:'Status', info:status},
      //   { title:'Total', info:`฿${total}`}
      // ]
      return (
        // <div className="w-full border rounded-md p-4 flex gap-x-4 items-center">
        //   {image ? <img src={image} className="rounded-full w-20 h-20 min-w-[80px]"/> : <SfThumbnail size="lg" className="bg-gray-100 h-20 w-20 min-w-[80px]"/>}
        //   <div className="flex flex-col gap-y-1 w-full">
        //     {data.map(d => (
        //       <div className="flex items-center justify-between">
        //         <h2 className="font-medium text-sm">{d.title}:</h2>
        //         <p className="text-sm">{d.info}</p>
        //       </div>
        //     ))}
        //   </div>
        // </div>
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
            <tr>
              <td>{name}-{}{company}</td>
              <td>{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }`}</td>
              <td>{status}</td>
              <td>฿{total}</td>
              <td>
                <Link to={`/order-history/${name}`}>View Details</Link>
              </td>
            </tr>
          </tbody>
        </table>
      )
    }

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
            <h1 className="mb-10 primary-heading text-center text-primary">Order history</h1>
            <div className="flex flex-col gap-y-4">
              <div className="hidden lg:flex border-b">
                {statusOptions.map(option => (
                    <button onClick={() => setSelectedStatus(option)} key={option} className={`w-full px-4 py-2 border-b-2 ${selectedStatus === option ? 'border-b-black' : 'border-b-white'}`}>{option}</button>
                ))}
              </div>
            <div className="hidden lg:flex items-center gap-x-2">
                    <label className="typography-text-sm font-medium">Show</label>
                    <SfSelect name="state" placeholder="-- Select --" onChange={(e) => setSelectedShow(e.target.value)} className="w-[200px]">
                        {showList.map((list, index) => (
                            <option key={index} value={list === 'All' ? filteredData.length : list}>{list === 'All' ? 'All orders' : `Last ${list} orders`}</option>
                        ))}
                    </SfSelect>
                </div>
                {!loading ? (
                  <table className="text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-4">Order No.</th>
                        <th className="py-4">Date</th>
                        <th className="py-4">Status</th>
                        <th className="py-4">Total</th>
                        <th className="py-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.slice(0, selectedShow).map(({name, status, base_total, company, items, creation}) => (
                        <tr className="border-b">
                          <td className="py-4 text-sm">{name}-{}{company}</td>
                          <td className="py-4 text-sm">{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }`}</td>
                          <td className="py-4 text-sm">{status}</td>
                          <td className="py-4 text-sm">฿{base_total}</td>
                          <td className="py-4 text-sm text-right">
                            <Link to={`/order-history/${name}`}>View Details</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <SfLoaderCircular />}
            {/* {!loading ? filteredData.slice(0, selectedShow).map(({name, status, base_total, company, items, creation}) => (
              <OrderList name={name} company={company} creation={creation} total={base_total} status={status}/>
            ))  : <SfLoaderCircular/>} */}
                </div>
        </MyAccountSection>
    );
}

export default OrderHistory;