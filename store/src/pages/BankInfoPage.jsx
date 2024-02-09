import { SfButton, SfTooltip, useDisclosure } from '@storefront-ui/react';
import { useState,React, useEffect} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import defaultLogo from '../assets/defaultBrandIcon.svg';
import { useSetting } from '../hooks/useWebsiteSettings';
import { useFormik } from "formik";
import { useFrappeGetCall, useFrappePostCall,useFrappeFileUpload, useFrappeAuth } from 'frappe-react-sdk';
import AddressCard from '../components/AddressCard';
import { Icons } from '../components/icons';
import { Skeleton } from '../components/Skeleton';
import { useUser } from '../hooks/useUser';
import Modal from '../components/drawers/Modal';

const BankInfoPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { appLogo, defaultTaxe } = useSetting()
    const payment_method = searchParams.get("payment_method");
    const [Order, setOrder] = useState([])
    const [randomKey, setrandomKey] = useState(0)
    const [Pagestep, setPagestep] = useState(0)
    const [paymentinfo, setpaymentinfo] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
    const [image, setImage] = useState(null)
    const [imgtoupload, setimgtoupload] = useState()
    const { upload, loading: uploadingFile, progress, error: errorUploadingDoc, reset: resetUploadDoc } = useFrappeFileUpload()
    const [paymentcompleted, setpaymentcompleted] = useState(null)
    const [hideData, setHideData] = useState(false)
    const [bankselection, setbankselection] = useState(false)
    const [isTextCopied, setIsTextCopied] = useState(false)
    const [selectedBank, setSelectedBank] = useState(null)
    const { user } = useUser();
    const { isOpen:isModalOpen, open:openModal, close:closeModal } = useDisclosure({ initialValue: false });

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
                if (values.file){
                    upload(values.file, {
                        isPrivate: true,
                        doctype: 'Raven Message',
                        fieldname: 'file',
                    })
                    .then(response => {
                        const apiData = {
                            'order_name': Order.name,
                            'payment_file': response.name
                        };
                        const updatedValues = { ...values, ...apiData };

                        call(updatedValues).then(response => {
                            setpaymentcompleted(response);
                        })
                    })
                    .catch(error => {
                        console.error("File upload failed:", error);
                    });
                    formik.resetForm();
                }
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

    function handleChange(event){
        setimgtoupload(event);
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
        formik.setFieldValue("file", event.currentTarget.files[0]);
        formik.setFieldValue('order_name', Order.name);
        formik.setFieldValue('payment_info', paymentinfo.key);
        if(bankselection){
            formik.setFieldValue('bank', bankselection);
        }
    }

    const fileSize = (size) => {
        if (size >= 1024 * 1024){
            return `${(size / (1024 * 1024)).toFixed(1)} MB`
        } else if (size >= 1024){
            return `${(size / 1024).toFixed(1)} KB`
        } else {
            return `${(size).toFixed(1)} B`
        }
    }

    function SubmitNow(){
        //formik.setFieldValue('order_name', Order.name);
        //formik.setFieldValue('payment_info', paymentinfo.key);
        //console.log(formik.values);
       // formik.validateForm().then((zz) => {
            formik.submitForm();
            setPagestep(3)
       // })
    }

    const receiptTitle = 
        Pagestep == 1 ? `ชำระเงินด้วย ${paymentinfo.name}` :
        Pagestep == 2 ? 'แจ้งการชำระเงิน' :
        Pagestep == 3 ? 'แจ้งชำระเงินสำเร็จ'
        : 'บริษัท เดอะแบรนด์ แอน ซาเวียโก จำกัด'

    const CopyButton = ({children}) => {
        return (
            <SfTooltip label={isTextCopied ? 'คัดลอกแล้ว' : 'คัดลอก'}>
                <div onMouseOut={() => setIsTextCopied(false)}>
                    {children}
                </div>
            </SfTooltip>
        )
    }

    const copyInfo = {
        accountNum: () => {
            setIsTextCopied(true);
            navigator.clipboard.writeText(paymentinfo.promptpay_number)
        },
        bankNum: (acc) => {
            setIsTextCopied(true);
            navigator.clipboard.writeText(acc)
        }
    }

    return (
        <div className='py-10 w-full'>
            <div className='max-w-[513px] mx-auto flex flex-col gap-y-12 p-8 border border-neutral-50 rounded-[30px]'>
                <div className='flex justify-center'>
                    <picture className='cursor-pointer' onClick={openModal}>
                    <source srcSet={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo} media="(min-width: 768px)" />
                    <img
                        src={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo}
                        alt="Sf Logo"
                        className='max-h-10'
                    />
                    </picture>
                </div>
                <Modal open={openModal} isOpen={isModalOpen} close={closeModal}>
                    <div className='flex flex-col gap-y-6'>
                        <h1 className='text-black text-2xl font-semibold'>ออกจากขั้นตอนการชำระเงิน ?</h1>
                        <p className='text-darkgray'>เมื่อคุณออกจากขั้นตอนการชำระเงิน<br/> ระบบจะบันทึกสถานะคำสั่งซื้อว่า “ยังไม่ได้ชำระเงิน”<br/> คุณต้องการออกจากขั้นตอนการชำระเงินหรือไม่</p>
                    </div>

                    <div className='flex gap-x-3 w-full'>
                        <SfButton variant='tertiary' className='w-full btn-secondary h-[50px] rounded-xl' onClick={closeModal}>
                            ดำเนินการต่อ
                        </SfButton>
                        <SfButton variant='tertiary' className='w-full btn-primary h-[50px] rounded-xl' onClick={() => navigate('/home/all items')}>
                            ออกจากการชำระเงิน
                        </SfButton>
                    </div>
                </Modal>
                <div className='flex flex-col gap-y-12'>
                    <div className='flex flex-col gap-y-4'>
                        <h2 className='text-center text-[22px] font-semibold leading-[30px]'>{receiptTitle}</h2>
                        {Pagestep == 0 || Pagestep == 3 ? (
                            <div className='flex flex-col text-center gap-y-[6px] text-sm tracking-[-0.4px] font-semibold'>
                                {Pagestep == 0 ? (
                                    <>{user && (
                                        <p className='leading-6'>
                                            อีเมล : {user?.user?.email}<br/>
                                            เบอร์โทร : {user?.user?.phone}
                                        </p>
                                    )}</>
                                ) : (
                                    <p className='leading-6'>
                                        ขอบคุณสำหรับการสั่งซื้อสินค้า<br/>
                                        คุณสามารถไปที่ คำสั่งซื้อของฉัน เพื่อติดตามสถานะ<br/>
                                        คำสั่งซื้อของคุณ<br/>
                                    </p>
                                )}
                            </div>
                        ) : null}
                    </div>
                    <div className='flex flex-col gap-y-[14px]'>

                        {/* {console.log(Order.grand_total)} */}

                    {payment_method == 1 && (
                        <>
                        <form className="w-full flex flex-col gap-9 text-neutral-900">
                            {Pagestep === 0 && (
                                <>

                                    {/* <h1 className='text-lg text-center font-medium'>Setp 1 Order Deatils</h1> */}
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                        <p className='font-semibold'>{Order.name}</p>
                                    </div>

                                    <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                        <div className='p-6 pb-5 flex items-center justify-between w-full cursor-pointer'>
                                            <div className='flex items-center gap-x-2'>
                                                <Icons.wallet04 color='#666666' className='min-w-6'/>
                                                <span className='font-bold text-darkgray'>วิธีการชำระเงิน</span>
                                            </div>
                                            {paymentinfo.name}
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-y-6'>
                                        <div className="flex justify-between items-center">
                                            <p className='text-secgray text-sm'>ยอดรวมทั้งสิ้น</p>
                                            <p className='text-right text-sm font-semibold text-secgray'>{Order?.items?.length} ชิ้น</p>
                                        </div>
                                        <div className='flex items-center justify-center gap-x-1'>
                                            <h1 className='text-[40px] font-semibold'>฿{Order.grand_total?.toFixed(2)}</h1>
                                        </div>
                                    </div>

                                    <div className='flex flex-col justify-center gap-4 items-center'>
                                        <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => setPagestep(1)}>
                                            ชำระเงิน
                                        </SfButton>
                                        <a className='text-secgray text-sm cursor-pointer inline-block w-fit' onClick={() => setHideData(!hideData)}>{hideData ? 'แสดงข้อมูล' : 'ซ่อนข้อมูล'}</a>
                                    </div>
                                    {/* <div className='flex items-center justify-center gap-x-1'>
                                        Render HTML content using dangerouslySetInnerHTML
                                        <div dangerouslySetInnerHTML={{ __html: Order.address_display }} />
                                    </div> */}

                                    {/* Insert address_display into an address card, which I already created CSS in case of CSS styles */}
                                    {!hideData && (
                                        <>
                                        <AddressCard address_title={Order.name} address_line1={<div dangerouslySetInnerHTML={{ __html: Order.address_display }} />} deletebtn={false} active={true}/>

                                        {Order.items?.map((d, index) => (
                                            <div key={index} className='flex justify-between'>
                                                <div className='flex flex-col gap-y-[10px]'>
                                                    <h2 className='text-sm text-darkgray'>{d.item_name}</h2>
                                                    <p className='text-sm font-semibold'>{d.qty} ชิ้น</p>
                                                </div>
                                                <p className='text-sm font-semibold'>฿{d.rate.toFixed(2)}</p>
                                            </div>
                                        ))}
                                        </>
                                    )}

                                    <div>Your content for payment_method 1 and Pagestep 1</div>
                                </>
                            )}

                            {Pagestep === 1 && (
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 2 QR Deatils</h1>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-sm text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                        <p className='text-sm font-semibold'>123123123</p>
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

                                    <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => setPagestep(2)}>
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
                                    <input type='file' className='hidden' id='file-upload' onChange={handleChange} accept='image/*' />
                                    {image && <img alt="preview image" src={image} />}

                                    <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => SubmitNow()}>PayNow</SfButton>
                                    <div>Your content for payment_method 1 and Pagestep 2</div>
                                </>
                            )}

                        </form>              

                        </>
                    )}


                    {payment_method == 2 && (
                        <>
                            {Pagestep === 0 && (
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 1 Order Deatils</h1>
                                    <div className='flex flex-col gap-y-6'>
                                        <div className="flex justify-between items-center">
                                            <p className='text-secgray text-sm'>ยอดรวมทั้งสิ้น</p>
                                            <p className='text-right text-sm font-semibold text-secgray'>{Order?.items?.length} ชิ้น</p>
                                        </div>
                                        <div className='flex items-center justify-center gap-x-1'>
                                            <h1 className='text-[40px] font-semibold'>฿{Order.grand_total?.toFixed(2)}</h1>
                                        </div>
                                    </div>
                                    {/* <div className='flex items-center justify-center gap-x-1'>
                                        Render HTML content using dangerouslySetInnerHTML 
                                        <div dangerouslySetInnerHTML={{ __html: Order.address_display }} />
                                    </div> */}

                                    <div className='flex flex-col justify-center gap-4 items-center'>
                                        <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => setPagestep(1)}>
                                            ชำระเงิน
                                        </SfButton>
                                        <a className='text-secgray text-sm cursor-pointer inline-block w-fit' onClick={() => setHideData(!hideData)}>{hideData ? 'แสดงข้อมูล' : 'ซ่อนข้อมูล'}</a>
                                    </div>

                                    {!hideData && (
                                        <><AddressCard address_title={Order.name} address_line1={<div dangerouslySetInnerHTML={{ __html: Order.address_display }} />} deletebtn={false} active={true}/>

                                        {Order.items?.map((d, index) => (
                                            <div key={index} className='flex items-center justify-center gap-x-1'>
                                                <h2 className='text-sm font-medium'>{d.item_name}: </h2>
                                                <p className='text-sm'>{d.rate}</p>
                                            </div>
                                        ))}</>
                                    )}

                                    <div>Your content for payment_method 2 and Pagestep 1</div>
                                </>
                            )}

                            {Pagestep === 1 && (
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 2 Bank Details</h1>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-sm text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                        <p className='text-sm font-semibold'>123123123</p>
                                    </div>

                                    {paymentinfo.banks_list?.map((d, index) => (
                                        <div key={index} className='justify-center gap-x-1 bankdetails'>
                                            <label htmlFor={`bank${index}`}>
                                                <h2 className='text-sm font-medium'>{d.bank}: </h2>
                                                <p className='text-sm'>{d.bank_account_name}</p>
                                                <p className='text-sm'>{d.bank_account_number}</p>
                                            </label>
                                        </div>
                                    ))}
                                    

                                    <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => setPagestep(2)}>
                                        PayNow
                                    </SfButton>
                                    <div>Your content for payment_method 2 and Pagestep 2</div>
                                </>
                            )}

                            {Pagestep === 2 && (
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 2 Bank Details</h1>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-sm text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                        <p className='text-sm font-semibold'>123123123</p>
                                    </div>

                                    {paymentinfo.banks_list?.map((d, index) => (
                                        <div key={index} className='justify-center gap-x-1 bankdetails'>
                                            <input 
                                                type="radio"
                                                id={`bank${index}`}
                                                name="selectedBank"
                                                value={d.bank}
                                                className="mr-2"
                                                onChange={(e) => setbankselection(e.target.value)}
                                            />
                                            <label htmlFor={`bank${index}`}>
                                                <h2 className='text-sm font-medium'>{d.bank}: </h2>
                                                <p className='text-sm'>{d.bank_account_name}</p>
                                                <p className='text-sm'>{d.bank_account_number}</p>
                                            </label>
                                        </div>
                                    ))}
                                    

                                    <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => bankselection && setPagestep(3)}>
                                        PayNow
                                    </SfButton>
                                    <div>Your content for payment_method 2 and Pagestep 2</div>
                                </>
                            )}

                            {Pagestep === 3 && (
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
                                    <input type='file' className='hidden' id='file-upload' onChange={handleChange} accept='image/*' />
                                    {image && <img alt="preview image" src={image} />}


                                    <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => SubmitNow()}>PayNow</SfButton>
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