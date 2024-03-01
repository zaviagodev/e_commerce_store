import { SfButton, SfTooltip, useDisclosure } from '@storefront-ui/react';
import { useState,React, useEffect, useCallback} from 'react';
import { Link, useLocation, useNavigate, useSearchParams, useBeforeUnload } from 'react-router-dom';
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
    const { isOpen: isModalOpen, open: openModal, close: closeModal } = useDisclosure({ initialValue: false });

    const [modalOpen, setModalOpen] = useState(false);
        
    const onBackButtonEvent = (e: any) => {
        e.preventDefault();
            setModalOpen(true)
    }

    useEffect(() => {
        window.history.pushState(null, 'null', window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
      }, []);

    
    const handleContinue = () => {
        setModalOpen(false);
        navigate(-1);
    };

    const handleStay = () => {
        setModalOpen(false);
    };



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
      const file = event.target.files[0];
      const maxSize = 1024 * 1024; // 1.0 MB
      if (file.size > maxSize) {
          alert("file uploaded is bigger then 1.0 MB.");
      } else {
          setimgtoupload(event);
          if (event.target.files && event.target.files[0]) {
              setImage(URL.createObjectURL(event.target.files[0]));
          }
          formik.setFieldValue("file", event.currentTarget.files[0]);
          formik.setFieldValue('order_name', Order.name);
          formik.setFieldValue('payment_info', paymentinfo.key);
          if (bankselection) {
              formik.setFieldValue('bank', bankselection);
          }
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

    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    // const location = useLocation()

    // useEffect(() => {
    //     function handleOnBeforeUnload(event){
    //         if (event.state){
    //             navigate(location.pathname + location.search)
    //             openModal()
    //         }
    //     }

    //     window.addEventListener('popstate', handleOnBeforeUnload)
    // }, [location])

    return (
        <div className='py-10 w-full'>
            {modalOpen && (
                <dialog>
                    <p>Are you sure you want to navigate away?</p>
                    <button onClick={handleStay}>Stay</button>
                    <button onClick={handleContinue}>Continue</button>
                </dialog>
            )}
            <div className='max-w-[513px] mx-auto flex flex-col gap-y-12 p-8 rounded-[30px]'>
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
                        <p className='text-darkgray px-5'>ออเดอร์ของคุณ “ยังชำระเงินไม่สำเร็จ” คุณสามารถชำระเงินอีกครั้งได้ที่หน้าประวัติคำสั่งซื้อหรืออยู่ในหน้านี้ต่อ เพื่อยืนยันการชำระเงิน</p>
                    </div>

                    <div className='flex gap-x-3 w-full'>
                        <SfButton variant='tertiary' className='w-full btn-secondary h-[50px] rounded-xl' onClick={closeModal}>
                            อยู่ในหน้านี้
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

                                    {paymentinfo.name ? (
                                        <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                            <div className='px-6 py-3 flex items-center justify-between w-full'>
                                                <div className='flex items-center gap-x-2'>
                                                    <Icons.wallet04 color='#666666' className='min-w-6'/>
                                                    <span className='font-bold text-darkgray'>วิธีการชำระเงิน</span>
                                                </div>
                                                <p className='font-semibold'>{paymentinfo.name}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Skeleton className='h-12 w-full'/>
                                    )}

                                    {Order ? (
                                        <div className='flex flex-col gap-y-[26px]'>
                                            <div className="flex justify-between items-center">
                                                <p className='text-secgray text-sm'>ยอดรวมทั้งสิ้น</p>
                                                <p className='text-right text-sm font-semibold text-secgray'>{Order?.items?.length} ชิ้น</p>
                                            </div>
                                            <h1 className='text-[40px] font-semibold text-center leading-5'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col gap-y-[26px]'>
                                            <Skeleton className='h-4 w-full'/>
                                            <Skeleton className='h-8 w-full'/>
                                        </div>
                                    )}

                                    <div className='flex flex-col justify-center gap-3 items-center'>
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
                                        <div className='flex flex-col gap-9'>
                                        <AddressCard address_title={Order.shipping_address_name} address_line1={<div dangerouslySetInnerHTML={{ __html: Order.address_display }} />} deletebtn={false} active={true}/>

                                        <section className='flex flex-col gap-y-4'>
                                            <div className='flex flex-col gap-9'>
                                                {Order.items?.map((d, index) => (
                                                    <div key={index} className='flex justify-between'>
                                                        <div className='flex flex-col gap-y-1'>
                                                            <h2 className='text-sm text-darkgray'>{d.item_name}</h2>
                                                            <p className='text-sm font-semibold'>{d.qty} ชิ้น</p>
                                                        </div>
                                                        <p className='text-sm font-semibold'>฿ {d.rate.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className='flex flex-col pt-4 border-t gap-y-4'>
                                                <div className="flex justify-between items-center">
                                                    <p className='font-semibold text-sm'>ราคาสินค้าทั้งหมด</p>
                                                    <p className='font-semibold text-sm'>฿ {Order.base_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-maingray text-sm">ค่าจัดส่ง</p>
                                                    <p className="text-maingray font-semibold text-sm">฿ 0</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className='text-maingray text-sm'>
                                                        ภาษีมูลค่าเพิ่ม
                                                        {defaultTaxe && ` (${
                                                            defaultTaxe?.rate !== 0 ? defaultTaxe?.rate+'%' : ''
                                                        }${
                                                            defaultTaxe?.rate !== 0 && defaultTaxe?.amout !== 0 ? ' + ' : ''
                                                        }${
                                                            defaultTaxe?.amout !== 0 ? +defaultTaxe?.amout + '฿ ' : ''
                                                        })`}
                                                    </p>
                                                    <p className='text-maingray font-semibold text-sm'>-</p>
                                                </div>
                                                <div className='flex justify-between pt-4 border-t'>
                                                    <p className='font-semibold text-sm'>ยอดรวมทั้งสิ้น</p>
                                                    <p className='font-semibold text-sm text-right'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                            </div>
                                        </section>
                                        </div>
                                    )}

                                    <div>Your content for payment_method 1 and Pagestep 1</div>
                                </>
                            )}

                            {Pagestep === 1 && (
                                <>
                                    {/* <h1 className='text-lg text-center font-medium'>Setp 2 QR Deatils</h1> */}
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                        <p className='font-semibold'>{Order.name}</p>
                                    </div>

                                    <div className='flex items-center justify-center gap-x-1'>
                                        <img
                                            src={paymentinfo.promptpay_qr_image ? `${import.meta.env.VITE_ERP_URL ?? ''}${paymentinfo.promptpay_qr_image}` : ""}
                                            alt="Sf Logo"
                                        />
                                    </div>
                                    
                                    <div className='flex flex-col gap-y-6'>
                                        {paymentinfo.account_name && (
                                            <div className='flex items-center justify-between'>
                                                <h2 className='font-semibold text-secgray'>ชื่อบัญชี</h2>
                                                <p className='font-semibold'>{paymentinfo.account_name}</p>
                                            </div>
                                        )}
                                        {paymentinfo.promptpay_number && (
                                            <div className='flex items-center justify-between'>
                                                <h2 className='font-semibold text-secgray'>หมายเลขพร้อมเพย์</h2>
                                                <div className='flex gap-x-2 items-center'>
                                                    <p className='font-semibold'>{paymentinfo.promptpay_number}</p>
                                                    <CopyButton>
                                                        <Icons.copy06 className='cursor-pointer' onClick={copyInfo.accountNum}/>
                                                    </CopyButton>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex flex-col gap-y-[26px] items-center'>
                                        <p className='text-secgray text-sm'>ยอดรวมทั้งสิ้น</p>
                                        <h1 className='text-[40px] font-semibold text-center leading-5'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>
                                    </div>

                                    <div className='flex flex-col gap-y-4'>
                                        <a href={paymentinfo.promptpay_qr_image ? `${import.meta.env.VITE_ERP_URL ?? ''}${paymentinfo.promptpay_qr_image}` : ""} download={paymentinfo.name}>
                                            <SfButton variant='tertiary' className='w-full btn-secondary h-[50px] flex items-center gap-x-[10px]'>
                                                <Icons.download03 />
                                                บันทึก QR
                                            </SfButton>
                                        </a>
                                        <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => setPagestep(2)}>
                                            แจ้งชำระเงิน
                                        </SfButton>
                                    </div>
                                    <div>Your content for payment_method 1 and Pagestep 2</div>
                                </>
                            )}

                            {Pagestep === 2 && (
                                <>
                                    {/* <h1 className='text-lg text-center font-medium'>Setp 3 QR Deatils</h1> */}

                                    <div className='flex flex-col gap-y-[14px]'>
                                        <div className='flex items-center justify-between'>
                                            <h2 className='text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                            <p className='font-semibold'>{Order.name}</p>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <h2 className='text-secgray'>ยอดรวมทั้งสิ้น</h2>
                                            <p className='font-semibold'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-y-2'>
                                        <h2 className='font-semibold text-linkblack'>บัญชีธนาคารที่ชำระ</h2>
                                        <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                            <div className='px-6 py-3 flex flex-col w-full'>
                                                {paymentinfo.name && <p className='text-sm text-darkgray'>{paymentinfo.name}</p>}
                                                {paymentinfo.promptpay_number && <p className='font-semibold'>{paymentinfo.promptpay_number}</p>}
                                                {paymentinfo.account_name && <p className='text-sm font-semibold text-darkgray'>{paymentinfo.account_name}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-y-2'>
                                        <h2 className='font-semibold text-linkblack'>หลักฐานการชำระเงิน <span className='text-red-500'>*</span></h2>
                                        {image ? (
                                            <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                                <div className='px-3 h-[140px] flex w-full gap-x-3 items-center relative'>
                                                    <Icons.x onClick={() => setImage(null)} className='absolute top-6 right-4 cursor-pointer'/>
                                                    <img alt="preview image" src={image} width='76' height='76' className='h-[76px] w-[76px] object-cover aspect-square'/>
                                                    <div className='flex flex-col gap-y-1'>
                                                        <h2 className='font-semibold text-sm pr-4'>{imgtoupload?.target.files[0].name}</h2>
                                                        <p className='text-sm text-secgray'>{fileSize(imgtoupload?.target.files[0].size)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                        <><label htmlFor='file-upload' className='text-darkgray text-base cursor-pointer'>
                                            <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                                <div className='h-[140px] flex flex-col w-full justify-center items-center'>
                                                    <Icons.imagePlus />
                                                    <h2 className='text-lg font-semibold text-linkblack mt-3'>อัปโหลดสลิป</h2>
                                                    <p className='text-secgray text-xs'>รองรับ PNG หรือ JPG ขนาดไฟล์สูงสุด {fileSize(1024 * 1024)}</p>
                                                </div>
                                            </div>
                                        </label>
                                        <input type='file' className='hidden' id='file-upload' onChange={handleChange} accept=".png, .jpg, .jpeg" /></> 
                                        )}
                                    </div>

                                    {/* <label style={{ border: 'solid', textAlign: 'center', padding: '8px', cursor: 'pointer' }} htmlFor='file-upload' className='text-darkgray text-base'>
                                        Upload Now
                                    </label>
                                    <input type='file' className='hidden' id='file-upload' onChange={handleChange} accept='image/*' />
                                    {image && <img alt="preview image" src={image} />} */}

                                    <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => SubmitNow()}>ยืนยันการชำระเงิน</SfButton>
                                    <div>Your content for payment_method 1 and Pagestep 2</div>
                                </>
                            )}
                        </form>
                        </>
                    )}

                    {payment_method == 2 && (
                        <>
                        <form className="w-full flex flex-col gap-9 text-neutral-900">
                            {Pagestep === 0 && (
                                <>
                                    {/* <h1 className='text-lg text-center font-medium'>Setp 1 Order Deatils</h1> */}
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                        <p className='font-semibold'>{Order.name}</p>
                                    </div>

                                    {paymentinfo.name ? (
                                        <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                            <div className='px-6 py-3 flex items-center justify-between w-full'>
                                                <div className='flex items-center gap-x-2'>
                                                    <Icons.wallet04 color='#666666' className='min-w-6'/>
                                                    <span className='font-bold text-darkgray'>วิธีการชำระเงิน</span>
                                                </div>
                                                <p className='font-semibold'>{paymentinfo.name}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Skeleton className='h-12 w-full'/>
                                    )}

                                    <div className='flex flex-col gap-y-[26px]'>
                                        <div className="flex justify-between items-center">
                                            <p className='text-secgray text-sm'>ยอดรวมทั้งสิ้น</p>
                                            <p className='text-right text-sm font-semibold text-secgray'>{Order?.items?.length} ชิ้น</p>
                                        </div>
                                        <h1 className='text-[40px] font-semibold text-center leading-5'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>
                                    </div>

                                    <div className='flex flex-col justify-center gap-3 items-center'>
                                        <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => setPagestep(1)}>
                                            ชำระเงิน
                                        </SfButton>
                                        <a className='text-secgray text-sm cursor-pointer inline-block w-fit' onClick={() => setHideData(!hideData)}>{hideData ? 'แสดงข้อมูล' : 'ซ่อนข้อมูล'}</a>
                                    </div>
                                    {/* <div className='flex items-center justify-center gap-x-1'>
                                        Render HTML content using dangerouslySetInnerHTML 
                                        <div dangerouslySetInnerHTML={{ __html: Order.address_display }} />
                                    </div> */}

                                    {!hideData && (
                                        <div className='flex flex-col gap-9'>
                                        <AddressCard address_title={Order.name} address_line1={<div dangerouslySetInnerHTML={{ __html: Order.address_display }} />} deletebtn={false} active={true}/>

                                        <section className='flex flex-col gap-y-4'>
                                            <div className='flex flex-col gap-9'>
                                                {Order.items?.map((d, index) => (
                                                    <div key={index} className='flex justify-between'>
                                                        <div className='flex flex-col gap-y-1'>
                                                            <h2 className='text-sm text-darkgray'>{d.item_name}</h2>
                                                            <p className='text-sm font-semibold'>{d.qty} ชิ้น</p>
                                                        </div>
                                                        <p className='text-sm font-semibold'>฿ {d.rate.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className='flex flex-col pt-4 border-t gap-y-4'>
                                                <div className="flex justify-between items-center">
                                                    <p className='font-semibold text-sm'>ราคาสินค้าทั้งหมด</p>
                                                    <p className='font-semibold text-sm'>฿ {Order.base_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-maingray text-sm">ค่าจัดส่ง</p>
                                                    <p className="text-maingray font-semibold text-sm">฿ 0</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className='text-maingray text-sm'>
                                                        ภาษีมูลค่าเพิ่ม
                                                        {defaultTaxe && ` (${
                                                            defaultTaxe?.rate !== 0 ? defaultTaxe?.rate+'%' : ''
                                                        }${
                                                            defaultTaxe?.rate !== 0 && defaultTaxe?.amout !== 0 ? ' + ' : ''
                                                        }${
                                                            defaultTaxe?.amout !== 0 ? +defaultTaxe?.amout + '฿' : ''
                                                        })`}
                                                    </p>
                                                    <p className='text-maingray font-semibold text-sm'>-</p>
                                                </div>
                                                <div className='flex justify-between pt-4 border-t'>
                                                    <p className='font-semibold text-sm'>ยอดรวมทั้งสิ้น</p>
                                                    <p className='font-semibold text-sm text-right'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                            </div>
                                        </section>
                                        </div>
                                    )}

                                    <div>Your content for payment_method 2 and Pagestep 1</div>
                                </>
                            )}

                            {Pagestep === 1 && (
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 2 Bank Details</h1>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                        <p className='font-semibold'>{Order.name}</p>
                                    </div>

                                    <div className='flex flex-col gap-y-3'>
                                        {paymentinfo.banks_list?.map((d, index) => (
                                            <div key={index} className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden bankdeatils'>
                                                <div className='px-6 py-3 flex flex-col w-full'>
                                                    <h2 className='text-sm text-darkgray'>{d.bank}</h2>
                                                    <div className='flex justify-between w-full items-center'>
                                                        <p className='font-semibold'>{d.bank_account_number}</p>
                                                        <CopyButton>
                                                            <Icons.copy06 className='cursor-pointer' onClick={() => copyInfo.bankNum(d.bank_account_number)}/>
                                                        </CopyButton>
                                                    </div>
                                                    <p className='text-sm font-semibold text-darkgray'>{d.bank_account_name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='flex flex-col gap-y-[26px] items-center'>
                                        <p className='text-secgray text-sm'>ยอดรวมทั้งสิ้น</p>
                                        <h1 className='text-[40px] font-semibold text-center leading-5'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>
                                    </div>

                                    <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => setPagestep(2)}>
                                        แจ้งชำระเงิน
                                    </SfButton>
                                    <div>Your content for payment_method 2 and Pagestep 2</div>
                                </>
                            )}

                            {Pagestep === 2 && (
                                <>
                                    <h1 className='text-lg text-center font-medium'>Setp 3 Invoice Deatils</h1>

                                    <div className='flex flex-col gap-y-[14px]'>
                                        <div className='flex items-center justify-between'>
                                            <h2 className='text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                            <p className='font-semibold'>{Order.name}</p>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <h2 className='text-secgray'>ยอดรวมทั้งสิ้น</h2>
                                            <p className='font-semibold'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-y-2'>
                                        <h2 className='font-semibold text-linkblack'>บัญชีธนาคารที่ชำระ <span className='text-red-500'>*</span></h2>
                                        {paymentinfo.banks_list?.map((d, index) => (
                                            <><label key={index} htmlFor={`bank-${index}`} className='cursor-pointer'>
                                                <div className={`border ${selectedBank === `bank-${index}` ? 'border-black' : 'border-lightgray'} rounded-xl bg-neutral-50 overflow-hidden bankdeatils`}>
                                                    <div className='p-4 flex w-full items-center gap-x-3'>
                                                        <div className='flex gap-x-[10px] items-center'>
                                                            <span className='h-[18px] w-[18px] border border-black rounded-full bg-white flex items-center justify-center'>
                                                                {selectedBank === `bank-${index}` && <span className='flex h-3 w-3 bg-black rounded-full' />}
                                                            </span>
                                                            <img src="" />{/* Payment info logo will be inserted here */}
                                                        </div>
                                                        <div className='flex flex-col gap-y-1'>
                                                            <h2 className='text-sm text-darkgray'>{d.bank}</h2>
                                                            <p className='font-semibold'>{d.bank_account_number}</p>
                                                            <p className='text-sm font-semibold text-darkgray'>{d.bank_account_name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                            <input type='radio' className='hidden' id={`bank-${index}`} name="bank" value={d.bank} onChange={(e) => setSelectedBank(e.target.id)}/></>
                                        ))}
                                    </div>

                                    <div className='flex flex-col gap-y-2'>
                                        <h2 className='font-semibold text-linkblack'>หลักฐานการชำระเงิน <span className='text-red-500'>*</span></h2>
                                        {image ? (
                                            <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                                <div className='px-3 h-[140px] flex w-full gap-x-3 items-center relative'>
                                                    <Icons.x onClick={() => setImage(null)} className='absolute top-6 right-4 cursor-pointer'/>
                                                    <img alt="preview image" src={image} width='76' height='76' className='h-[76px] w-[76px] object-cover aspect-square'/>
                                                    <div className='flex flex-col gap-y-1'>
                                                        <h2 className='font-semibold text-sm pr-4'>{imgtoupload?.target.files[0].name}</h2>
                                                        <p className='text-sm text-secgray'>{fileSize(imgtoupload?.target.files[0].size)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                        <><label htmlFor='file-upload' className='text-darkgray text-base cursor-pointer'>
                                            <div className='border border-lightgray rounded-xl bg-neutral-50 overflow-hidden'>
                                                <div className='h-[140px] flex flex-col w-full justify-center items-center'>
                                                    <Icons.imagePlus />
                                                    <h2 className='text-lg font-semibold text-linkblack mt-3'>อัปโหลดสลิป</h2>
                                                    <p className='text-secgray text-xs'>รองรับ PNG หรือ JPG ขนาดไฟล์สูงสุด {fileSize(1024 * 1024)}</p>
                                                </div>
                                            </div>
                                        </label>
                                        <input type='file' className='hidden' id='file-upload' onChange={handleChange} accept=".png, .jpg, .jpeg"/></> 
                                        )}
                                    </div>

                                    <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => SubmitNow()}>ยืนยันการชำระเงิน</SfButton>
                                    <div>Your content for payment_method 2 and Pagestep 2</div>
                                </>
                            )}
                        </form>
                        </>
                    )}

                    {Pagestep === 3 && (
                        <div className='flex flex-col gap-y-9'>
                            <div className='flex flex-col gap-y-[14px]'>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-secgray'>เลขที่คำสั่งซื้อ</h2>
                                    <p className='font-semibold'>{Order.name}</p>
                                </div>

                                <div className='flex items-center justify-between'>
                                    <h2 className='text-secgray'>ยอดรวมทั้งสิ้น</h2>
                                    <p className='font-semibold'>฿ {Order.grand_total?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center gap-3 items-center'>
                                <SfButton variant='tertiary' className='w-full btn-primary h-[50px]' onClick={() => navigate('/home/all items')}>
                                    กลับไปยังร้านค้า
                                </SfButton>
                                <Link to={`/order-history/${Order.name}`} className='text-secgray text-sm cursor-pointer inline-block w-fit'>คำสั่งซื้อของฉัน</Link>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankInfoPage