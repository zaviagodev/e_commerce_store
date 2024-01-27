import { SfButton } from '@storefront-ui/react';
import { useState,React} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import defaultLogo from '../assets/defaultBrandIcon.svg';
import { useSetting } from '../hooks/useWebsiteSettings';
import { useFrappeGetCall } from 'frappe-react-sdk';


const BankInfoPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { appLogo } = useSetting()
    const payment_method = searchParams.get("payment_method");
    const [Order, setOrder] = useState([])
    const [randomKey, setrandomKey] = useState(0)
    const [Pagestep, setPagestep] = useState(0)
    const [paymentinfo, setpaymentinfo] = useState(0)

    const { mutate: mutateOrder, error: orderError } = useFrappeGetCall('webshop.webshop.api.get_orders', null, `orders-${randomKey}`,{
          isOnline: () => Order.length === 0,
          onSuccess: (data) => {
            data.message?.map((dd) => {
              if (dd.name == searchParams.get("order_id")) {
                setOrder(dd);
              }
              return null;
            });
          },
        }
    );
    const { data:paymentmethods } = useFrappeGetCall('webshop.webshop.api.payment_info', null, `payments-${randomKey}`,{
        isOnline: () => Order.length === 0,
        onSuccess: (data) => {
          data.message?.map((dd) => {
            if (dd.key == searchParams.get("payment_method")) {
                setpaymentinfo(dd);
            }
            return null;
          });
        },
      }
  );


    const data = [
      { title:'Order ID', info:searchParams.get("order_id")},
      { title:'Date', info:''},
      { title:'Total', info:`฿${searchParams.get("amount")}`}
    ]

    return (
        <div className='pt-10 w-full'>
            <div className='max-w-[549px] mx-auto flex flex-col gap-y-9 p-8 border border-neutral-50 rounded-[30px]'>
                <div className='flex justify-center'>
                    <picture>
                    <source srcSet={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo} media="(min-width: 768px)" />
                    <img
                        src={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo}
                        alt="Sf Logo"
                        className='max-h-10'
                    />
                    </picture>
                </div>
                <div className='flex flex-col gap-y-[26px] py-4'>
                    <h1 className='text-lg text-center font-medium'>ใบเสร็จ บริษัท ซาเวียโก</h1>
                    <div className='flex flex-col gap-y-[14px]'>

                    {console.log(paymentinfo)}
                    {payment_method == 1 && (
                        <>
                            {Pagestep === 0 && (
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 1 Order Deatils</h1>
                                    <div className='flex items-center justify-center gap-x-1'>
                                        <h1>{Order.grand_total}</h1>
                                    </div>
                                    <div className='flex items-center justify-center gap-x-1'>
                                        {/* Render HTML content using dangerouslySetInnerHTML */}
                                        <div dangerouslySetInnerHTML={{ __html: Order.address_display }} />
                                    </div>

                                    {Order.items?.map((d, index) => (
                                        <div key={index} className='flex items-center justify-center gap-x-1'>
                                            <h2 className='text-sm font-medium'>{d.item_name}: </h2>
                                            <p className='text-sm'>{d.rate}</p>
                                        </div>
                                    ))}

                                    <SfButton variant='tertiary' className='w-full btn-primary' onClick={() => setPagestep(1)}>
                                        PayNow
                                    </SfButton>
                                    <div>Your content for payment_method 1 and Pagestep 1</div>
                                </>
                            )}

                            {Pagestep === 1 && (
                                
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 2 QR Deatils</h1>
                                    <div className='flex items-center justify-center gap-x-1'>
                                        <h2 className='text-sm font-medium'>Sales Invoice: </h2>
                                        <p className='text-sm'>123123123</p>
                                    </div>

                                    <div className='flex items-center justify-center gap-x-1'>
                                        <img
                                            src={paymentinfo.promptpay_qr_image ? `${import.meta.env.VITE_ERP_URL ?? ''}${paymentinfo.promptpay_qr_image}` : ""}
                                            alt="Sf Logo"
                                        />
                                    </div>
                                    {paymentinfo.account_name && (
                                        <div className='flex items-center justify-center gap-x-1'>
                                            <h2 className='text-sm font-medium'>Account Name </h2>
                                            <p className='text-sm'>{paymentinfo.account_name}</p>
                                        </div>
                                    )}

                                    {paymentinfo.promptpay_number && (
                                        <div className='flex items-center justify-center gap-x-1'>
                                            <h2 className='text-sm font-medium'>Account Number </h2>
                                            <p className='text-sm'>{paymentinfo.promptpay_number}</p>
                                        </div>
                                    )}

                                    <SfButton variant='tertiary' className='w-full btn-primary' onClick={() => setPagestep(2)}>
                                        PayNow
                                    </SfButton>
                                    <div>Your content for payment_method 1 and Pagestep 2</div>
                                </>
                            )}
                        </>
                    )}





                    </div>
                </div>
               
            </div>
        </div>
    )
}

export default BankInfoPage