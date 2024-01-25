import { useOrder } from "../hooks/useOrders";
import { useState, useEffect } from "react";
import { SfThumbnail, SfLoaderCircular, SfSelect, SfInput, SfButton } from "@storefront-ui/react";
import { Link } from "react-router-dom";
import MyAccountSection from "../components/MyAccountSection";
import { Skeleton } from "../components/Skeleton";
import { Icons } from "../components/icons";

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
    const [selectedStatus, setSelectedStatus] = useState('คำสั่งซื้อทั้งหมด')
    const [statusOptions, setStatusOptions] = useState(['All'])
    const showList = [5, 10, 20, 50, 100, 'All']
    const [selectedShow, setSelectedShow] = useState()

    useEffect(() => {
        if (Order.length > 0) {
            setLoading(false)
        }
        const uniqueStatuses = Array.from(new Set(Order.map(item => item.status)));
        setStatusOptions(['คำสั่งซื้อทั้งหมด', ...uniqueStatuses]);
    }, [Order])

    const filteredData = selectedStatus === 'คำสั่งซื้อทั้งหมด'
    ? Order
    : Order.filter(item => item.status === selectedStatus);

    return (
        <MyAccountSection>
            <h1 className='font-medium text-baselg text-darkgray mb-5'>คำสั่งซื้อ</h1>
            <div className="flex flex-col gap-y-10">
              <div className="hidden lg:flex border-b">
                {statusOptions.map(option => (
                  <button onClick={() => setSelectedStatus(option)} key={option} className={`w-full px-4 py-2 border-b-2 text-sm font-medium ${selectedStatus === option ? 'border-b-black' : 'border-b-white'}`}>{option}</button>
                ))}
              </div>
              <div className="flex gap-y-[30px] flex-col lg:hidden">
                {filteredData.map(({name, status, base_total, company, items, creation}) => (
                  <div className="border-b pb-[30px]">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-secgray text-sml">เลขคำสั่งซื้อ</td>
                          <td className="text-[22px] text-black font-medium text-right">{name}-{}{company}</td>
                        </tr>
                        <tr>
                          <td className="text-secgray text-sml">วันที่</td>
                          <td className="text-[22px] text-black font-medium text-right">{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }`}</td>
                        </tr>
                        <tr>
                          <td className="text-secgray text-sml">จำนวนสินค้า</td>
                          <td className="text-[22px] text-black font-medium text-right">{items.length}</td>
                        </tr>
                        <tr>
                          <td className="text-secgray text-sml">ยอดรวมทั้งหมด</td>
                          <td className="text-[22px] text-black font-medium text-right">฿{base_total.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>

                    <Link to={`/order-history/${name}`} className="w-full bg-neutral-50 border h-[50px] border-neutral-100 flex items-center justify-center gap-x-[6px] rounded-xl text-baselg font-medium">
                      <Icons.file06 />
                      รายละเอียด
                    </Link>
                  </div>
                ))}
              </div>
              <div className="hidden lg:block">
                {!loading ? (
                  <>
                    {filteredData.length > 0 ? (
                      <table className="text-left w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-6 text-sml w-1/3">เลขคำสั่งซื้อ</th>
                            <th className="py-6 text-sml w-1/6">วันที่</th>
                            <th className="py-6 text-sml w-1/6">จำนวนสินค้า</th>
                            <th className="py-6 text-sml w-1/6">ยอดรวมทั้งหมด</th>
                            <th className="py-6 w-1/6"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map(({name, status, base_total, company, items, creation}) => (
                            <tr className="border-b">
                              <td className="py-6 text-sml w-1/3">{name}-{}{company}</td>
                              <td className="py-6 text-sml w-1/6">{`${new Date(creation).getDate()} ${month[new Date(creation).getMonth()]}, ${new Date(creation).getHours()}:${new Date(creation).getMinutes() < 10 ? '0' + new Date(creation).getMinutes(): new Date(creation).getMinutes() }`}</td>
                              <td className="py-6 text-sml w-1/6">{items.length}</td>
                              <td className="py-6 text-sml w-1/6">฿{base_total.toLocaleString()}</td>
                              <td className="py-6 text-sml w-1/6">
                                <Link to={`/order-history/${name}`} className='flex gap-x-[6px] items-center'>
                                  <Icons.file06 className='w-[9px] h-[9px]'/>
                                  รายละเอียด
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sml text-darkgray">คุณยังไม่มีคำสั่งซื้อ</p>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-y-2">
                    <Skeleton className='h-8 w-full'/>
                    <Skeleton className='h-8 w-full'/>
                    <Skeleton className='h-8 w-full'/>
                  </div>
                )}
              </div>
            </div>
        </MyAccountSection>
    );
}

export default OrderHistory;