import { useOrder } from "../hooks/useOrders";
import { useState, useEffect } from "react";
import { SfThumbnail, SfLoaderCircular, SfSelect, SfInput, SfButton } from "@storefront-ui/react";
import { Link } from "react-router-dom";
import MyAccountSection from "../components/MyAccountSection";
import { Skeleton } from "../components/Skeleton";
import { Icons } from "../components/icons";

function OrderHistory() {
    const {Order} = useOrder();
    const [loading, setLoading] = useState(true)
    const [selectedStatus, setSelectedStatus] = useState('คำสั่งซื้อทั้งหมด')
    const [statusOptions, setStatusOptions] = useState(['คำสั่งซื้อทั้งหมด'])
    const showList = [5, 10, 20, 50, 100, 'All']
    const [selectedShow, setSelectedShow] = useState()
    const day = (creation) => new Date(creation).getDate()
    const month = (creation) => new Date(creation).getMonth() + 1

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

    const handleStatusChange = (event) => {
      const newSelectedStatus = event.target.value;
      setSelectedStatus(newSelectedStatus);
    };

    return (
        <MyAccountSection>
            <div className="flex justify-between lg:block items-center">
              <h1 className='font-semibold text-baselg text-darkgray'>คำสั่งซื้อ</h1>
              <div className="lg:hidden">
                <SfSelect size='sm' className='!ring-0 !border-0 !pr-12 !bg-[#F3F3F3] !text-[#7A7A7A] !rounded-[9px] leading-6 text-sm font-semibold' onChange={handleStatusChange} value={selectedStatus}>
                  {statusOptions.map(option => (
                    <option key={option} className={`w-full px-4 py-2 border-b-2 text-sm font-semibold ${selectedStatus === option ? 'border-b-black' : 'border-b-white'}`}>{option}</option>
                  ))}
                </SfSelect>
              </div>
            </div>
            <div className="flex flex-col gap-y-10 mt-[50px] lg:mt-5">
              <div className="hidden lg:flex border-b h-[50px]">
                {statusOptions.map(option => (
                  <button onClick={() => setSelectedStatus(option)} key={option} className={`w-full px-2 py-4 border-b-2 text-sm ${selectedStatus === option ? 'border-b-black font-semibold text-linkblack' : 'border-b-white text-darkgray font-normal'}`}>{option}</button>
                ))}
              </div>
              <div className="flex gap-y-[30px] flex-col lg:hidden">
              {!loading ? (
                <>{filteredData.length > 0 ? (
                  <>{filteredData.map(({name, status, base_total, company, items, creation}) => (
                    <div className="border-b pb-[30px]">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="text-secgray text-sm py-[7px]">เลขคำสั่งซื้อ</td>
                            <td className="text-linkblack text-sm font-semibold text-right py-[7px]">{name}-{}{company}</td>
                          </tr>
                          <tr>
                            <td className="text-secgray text-sm py-[7px]">วันที่</td>
                            <td className="text-linkblack text-sm font-semibold text-right py-[7px]">{`${day(creation) < 10 ? "0" + day(creation) : day(creation)}/${month(creation) < 10 ? "0" + month(creation) : month(creation)}/${new Date(creation).getFullYear()}`}</td>
                          </tr>
                          <tr>
                            <td className="text-secgray text-sm py-[7px]">จำนวนสินค้า</td>
                            <td className="text-linkblack text-sm font-semibold text-right py-[7px]">{items.length}</td>
                          </tr>
                          <tr>
                            <td className="text-secgray text-sm py-[7px]">ยอดรวมทั้งหมด</td>
                            <td className="text-linkblack text-sm font-semibold text-right py-[7px]">฿ {base_total?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                          </tr>
                        </tbody>
                      </table>

                      <Link to={`/order-history/${name}`} className="w-full h-[50px] btn-secondary flex items-center justify-center gap-x-[6px] font-semibold mt-[7px]">
                        <Icons.file06 />
                        รายละเอียด
                      </Link>
                    </div>
                  ))}</>
                ) : (
                  <p className="text-xs text-darkgray">คุณยังไม่มีคำสั่งซื้อ</p>
                )}</>
              ) : (
                <div className="flex flex-col gap-y-2">
                  <Skeleton className='h-8 w-full'/>
                  <Skeleton className='h-8 w-full'/>
                  <Skeleton className='h-8 w-full'/>
                </div>
              )}
              </div>

              <div className="hidden lg:block">
                {!loading ? (
                  <>
                    {filteredData.length > 0 ? (
                      <table className="text-left w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-6 text-xs w-1/3">เลขคำสั่งซื้อ</th>
                            <th className="py-6 text-xs w-1/6 text-center">วันที่</th>
                            <th className="py-6 text-xs w-1/6 text-center">จำนวนสินค้า</th>
                            <th className="py-6 text-xs w-1/6 text-right">ยอดรวมทั้งหมด</th>
                            <th className="py-6 w-1/6"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map(({name, status, base_total, company, items, creation}) => (
                            <tr className="border-b">
                              <td className="py-6 text-sm w-1/3 text-darkgray">{name}-{}{company}</td>
                              <td className="py-6 text-sm w-1/6 text-darkgray text-center">{`${day(creation) < 10 ? "0" + day(creation) : day(creation)}/${month(creation) < 10 ? "0" + month(creation) : month(creation)}/${new Date(creation).getFullYear()}`}</td>
                              <td className="py-6 text-sm w-1/6 text-darkgray text-center">{items.length}</td>
                              <td className="py-6 text-sm w-1/6 text-darkgray text-right">฿ {base_total?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                              <td className="py-6 text-sm w-1/6">
                                <Link to={`/order-history/${name}`} className='flex gap-x-[6px] items-center text-sm justify-end'>
                                  <Icons.file06 className='w-[14px] h-[14px]'/>
                                  รายละเอียด
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-xs text-darkgray">คุณยังไม่มีคำสั่งซื้อ</p>
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