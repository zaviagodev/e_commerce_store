import { useOrder } from "../hooks/useOrders";
import { useState, useEffect } from "react";
import { SfThumbnail, SfLoaderCircular, SfSelect, SfInput, SfButton } from "@storefront-ui/react";
import { Link } from "react-router-dom";
import MyAccountSection from "../components/MyAccountSection";
import { Skeleton } from "../components/Skeleton";

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
    const [searchID, setSearchID] = useState({
      input: '',
      result: ''
    })

    useEffect(() => {
        if (Order.length > 0) {
            setLoading(false)
        }
        const uniqueStatuses = Array.from(new Set(Order.map(item => item.status)));
        setStatusOptions(['All', ...uniqueStatuses]);
    }, [Order])
  
    const filteredData = selectedStatus === 'All'
    ? Order.filter(item => item.name.includes(searchID.result))
    : Order.filter(item => item.status === selectedStatus && item.name.includes(searchID.result));

    return (
        <MyAccountSection>
            <h1 className="mb-10 primary-heading text-center text-primary">Order history</h1>
            <div className="flex flex-col gap-y-4">
              <div className="hidden lg:flex border-b">
                {statusOptions.map(option => (
                  <button onClick={() => setSelectedStatus(option)} key={option} className={`w-full px-4 py-2 border-b-2 text-sm font-medium ${selectedStatus === option ? 'border-b-black' : 'border-b-white'}`}>{option}</button>
                ))}
              </div>
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <label className="text-sm font-medium">Show</label>
                  <SfSelect name="state" placeholder="-- Select --" onChange={(e) => setSelectedShow(e.target.value)} className="w-[200px] text-sm">
                    {showList.map((list, index) => (
                      <option key={index} value={list === 'All' ? filteredData.length : list} className="text-sm">{list === 'All' ? 'All orders' : `Last ${list} orders`}</option>
                    ))}
                  </SfSelect>
                </div>
                <div className="flex items-center gap-x-2">
                  <SfInput className="!w-[200px] !h-[36px] text-sm" onChange={e => setSearchID({input: e.target.value, result:searchID.result})} placeholder="Search ID"/>
                  <SfButton variant="tertiary" className="btn-primary h-9 text-sm" onClick={() => setSearchID({result: searchID.input})}>Search</SfButton>
                </div>
              </div>
                {!loading ? (
                  <table className="text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-6 text-sm w-1/3">Order No.</th>
                        <th className="py-6 text-sm w-1/6">Date</th>
                        <th className="py-6 text-sm w-1/6">Status</th>
                        <th className="py-6 text-sm w-1/6">Total</th>
                        <th className="py-6 w-1/6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.slice(0, selectedShow).map(({name, status, grand_total, company, items, creation}) => (
                        <tr className="border-b">
                          <td className="py-6 text-sm w-1/3">{name}-{}{company}</td>
                          <td className="py-6 text-sm w-1/6">{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }`}</td>
                          <td className="py-6 text-sm w-1/6">{status}</td>
                          <td className="py-6 text-sm w-1/6">฿{grand_total}</td>
                          <td className="py-6 text-sm text-right w-1/6">
                            <Link to={`/order-history/${name}`} className=''>View Details</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col gap-y-2">
                    <Skeleton className='h-8 w-full'/>
                    <Skeleton className='h-8 w-full'/>
                    <Skeleton className='h-8 w-full'/>
                  </div>
                )}
            </div>
        </MyAccountSection>
    );
}

export default OrderHistory;