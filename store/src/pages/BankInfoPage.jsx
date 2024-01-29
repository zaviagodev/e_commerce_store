import { SfButton } from '@storefront-ui/react';
import { useState,React} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import defaultLogo from '../assets/defaultBrandIcon.svg';
import { useSetting } from '../hooks/useWebsiteSettings';
import { useFormik } from "formik";
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';


const BankInfoPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { appLogo } = useSetting()
    const payment_method = searchParams.get("payment_method");
    const [Order, setOrder] = useState([])
    const [randomKey, setrandomKey] = useState(0)
    const [Pagestep, setPagestep] = useState(0)
    const [paymentinfo, setpaymentinfo] = useState(0)
    const [isSaving, setIsSaving] = useState(false)

    const { call, isCompleted } = useFrappePostCall('webshop.webshop.api.payment_entry')
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            file: "",
            order_name: "",
            payment_info: "",
        },
        onSubmit: async (values) => {
            try {
                // Call your API function here (assuming `call` handles the API request)
                await call(values);
                // Handle success, reset form, or perform any additional logic
                formik.resetForm();
            } catch (error) {
                // Handle API error
                console.error("API Error:", error);
            }
        },
    });

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
    function handleChange(e){
        console.log(e.currentTarget.files);
        formik.setFieldValue("file", e.currentTarget.files[0]);
        formik.setFieldValue('order_name', Order.name);
        formik.setFieldValue('payment_info', paymentinfo.key);
    }
    function SubmitNow(){
        //formik.setFieldValue('order_name', Order.name);
        //formik.setFieldValue('payment_info', paymentinfo.key);
        //console.log(formik.values);
       // formik.validateForm().then((zz) => {
            formik.submitForm();
       // })
    }




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

                        {console.log(Order.grand_total)}

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



                            {Pagestep === 2 && (
                                
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 3 QR Deatils</h1>
                                    
                                    
                                    <div className='flex items-center justify-center gap-x-1'>
                                        <h2 className='text-sm font-medium'>Sales Invoice: </h2>
                                        <p className='text-sm'>123123123</p>
                                    </div>

                                    <div className='flex items-center justify-center gap-x-1'>
                                        <h2 className='text-sm font-medium'>Total: </h2>
                                        <p className='text-sm'>{Order.grand_total}</p>
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

                                    <label style={{ border: 'solid', textAlign: 'center', padding: '8px', cursor: 'pointer' }} htmlFor='file-upload' className='text-darkgray text-base'>
                                    Upload Now
                                    </label>
                                    <input type='file' className='hidden' id='file-upload' onChange={handleChange} />



                                    

                                    <SfButton variant='tertiary' className='w-full btn-primary' onClick={() => SubmitNow()}>PayNow</SfButton>
                                    <div>Your content for payment_method 1 and Pagestep 2</div>
                                </>
                            )}








                        </>
                    )}




                    {payment_method == 2 && (
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
                                    <div>Your content for payment_method 2 and Pagestep 1</div>
                                </>
                            )}

                            {Pagestep === 1 && (
                                
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 2 Bank Details</h1>
                                    <div className='flex items-center justify-center gap-x-1'>
                                        <h2 className='text-sm font-medium'>Sales Invoice: </h2>
                                        <p className='text-sm'>123123123</p>
                                    </div>

                                    {paymentinfo.banks_list?.map((d, index) => (
                                        <div key={index} className='justify-center gap-x-1 bankdeatils'>
                                            <h2 className='text-sm font-medium'>{d.bank}: </h2>
                                            <p className='text-sm'>{d.bank_account_name}</p>
                                            <p className='text-sm'>{d.bank_account_number}</p>
                                        </div>
                                    ))}
                                    

                                    <SfButton variant='tertiary' className='w-full btn-primary' onClick={() => setPagestep(2)}>
                                        PayNow
                                    </SfButton>
                                    <div>Your content for payment_method 2 and Pagestep 2</div>
                                </>
                            )}



                            {Pagestep === 2 && (
                                
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 3 Invoice Deatils</h1>
                                    
                                    
                                    <div className='flex items-center justify-center gap-x-1'>
                                        <h2 className='text-sm font-medium'>Sales Invoice: </h2>
                                        <p className='text-sm'>123123123</p>
                                    </div>

                                    <div className='flex items-center justify-center gap-x-1'>
                                        <h2 className='text-sm font-medium'>Total: </h2>
                                        <p className='text-sm'>{Order.grand_total}</p>
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

                                    <label style={{ border: 'solid', textAlign: 'center', padding: '8px', cursor: 'pointer' }} htmlFor='file-upload' className='text-darkgray text-base'>
                                    Upload Now
                                    </label>
                                    <input type='file' className='hidden' id='file-upload' onChange={handleChange} />



                                    

                                    <SfButton variant='tertiary' className='w-full btn-primary' onClick={() => SubmitNow()}>PayNow</SfButton>
                                    <div>Your content for payment_method 2 and Pagestep 2</div>
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