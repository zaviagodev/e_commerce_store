import { SfInput, SfButton, SfLink, SfModal, useDisclosure } from '@storefront-ui/react';
import { useFormik } from 'formik';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getToken } from '../utils/helper';
import { CSSTransition } from 'react-transition-group';
import * as Yup from 'yup';
import { Icons } from '../components/icons';

export default function Login() {
    const { logins, register } = useUser();
    const [loginState, setLoginState] = useState(true);
    const [apiResponse, setapiResponse] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false)

    const { isOpen, open:openRegisteredModal, close } = useDisclosure({ initialValue: false });
    const modalRef = useRef(null);
    const backdropRef = useRef(null);

    const navigate = useNavigate();
    const {
        currentUser,
        isLoading,
    } = useFrappeAuth();

    const getValidationSchema = () => {
        let schema = {};

        if (loginState) {
            schema['usr'] = Yup.string().equals([Yup.ref('usr')], 'enter username').required('จำเป็นต้องกรอกข้อมูล');
            schema['pwd'] = Yup.string().equals([Yup.ref('pwd')], 'Passwords must match').required('Required');
        }
        else{
            schema['email'] = Yup.string().email('Invalid email address').required('Required');
            schema['pwd'] = Yup.string().equals([Yup.ref('pwd_confirm')], 'Passwords must match').required('Required');
            schema['pwd_confirm'] = Yup.string().equals([Yup.ref('pwd')], 'Passwords must match').required('Required');
        }
        return Yup.object().shape(schema);
    };
    

    const formik = useFormik({
        initialValues: loginState ? {
            usr: '',
            pwd: '',
        } : {
            // first_name:'',
            // last_name:'',
            usr: '',
            email: '',
            pwd: '',
            pwd_confirm: ''
        },
        validationSchema: getValidationSchema(),
        onSubmit: (values) => {
            if (loginState == false) {
                 register(values.email,values.pwd).then((data) => {

                    if(data.message.message == 'Logged In'){
                        setLoginState(true);
                        setapiResponse('Registered successfully, Please Login');
                        openRegisteredModal()
                        //navigate("/home/all items")
                    }
                    else{
                        setapiResponse(data.message[1]);
                    } 
                })
            }else{
                logins(values.usr, values.pwd ).then((data) => {
                    if(data.message == 'Logged In' || data.message == 'No App'){
                        navigate("/home/all items")
                    }
                    else{
                        setapiResponse(data.message);
                    }
                });
            }
        }
    });

    useEffect(() => {
        if (getToken() || currentUser) {
            navigate("/home/all items");
        }
        // formik.validateForm();
    }, [ currentUser,  loginState ])

    const handleLoginState = () => {
        
        setLoginState(!loginState);
        setapiResponse('');
        setForgotPassword(false)
    }

    const handleForgotPass = (e) => {
        e.preventDefault()
        setForgotPassword(!forgotPassword)
    }

    return (
        <>
        <main className='main-section-login'>
        <h2 className="mb-[85px] text-primary text-center text-4xl font-semibold">{loginState ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
            <section className={`grid grid-cols-1 gap-[70px] mx-auto ${!loginState ? 'w-[410px]' : 'lg:grid-cols-2'}`}>
            <form className="flex gap-4 flex-wrap text-neutral-900 text-start text-big" onSubmit={formik.handleSubmit}>
                <h2 className="text-darkgray text-2xl font-semibold">{loginState ? forgotPassword ? 'รีเซ็ตรหัสผ่านของคุณ' : 'ลงชื่อเข้าใช้งาน' : 'ลงทะเบียนสมาชิกใหม่'}</h2>
                {forgotPassword && (
                    <p className='text-secgray'>ลงทะเบียนเพื่อเข้าถึง การสินค้าสุดพิเศษพร้อมกับสินค้ามาใหม่ เทรนด์ที่มาแรง ส่วนลดและโปรโมชั่นมากมายสำหรับสมาชิก</p>
                )}

                {apiResponse && <h2 className="mb-4 primary-heading text-primary text-center w-full">{apiResponse}</h2>}

                {loginState == true && 
                    <label className="w-full flex flex-col gap-0.5">
                        <SfInput name="usr" autoComplete="usr" onChange={formik.handleChange} value={formik.values.usr} 
                            wrapperClassName={`!bg-neutral-50 ${formik.errors.usr ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                            className={`bg-neutral-50 font-medium ${formik.errors.usr ? 'text-red-500' : 'text-darkgray'} `}
                            placeholder='อีเมล *'
                        />
                        <p className='text-red-500 text-sm'>{formik.errors.usr}</p>
                    </label>
                }

                {loginState == false && 
                <>
                {/* <label className="w-full flex flex-col gap-0.5">
                    <SfInput name="first_name" autoComplete="first_name" onChange={formik.handleChange} value={formik.values.first_name} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.first_name ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.first_name ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder='ชื่อ *'
                    />
                    <p className='text-red-500 text-sm'>{formik.errors.first_name}</p>
                </label>
                <label className="w-full flex flex-col gap-0.5">
                    <SfInput name="last_name" autoComplete="last_name" onChange={formik.handleChange} value={formik.values.last_name} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.last_name ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.last_name ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder='นามสกุล *'
                    />
                    <p className='text-red-500 text-sm'>{formik.errors.last_name}</p>
                </label> */}
                <label className="w-full flex flex-col gap-0.5">
                    <SfInput name="email" autoComplete="email" onChange={formik.handleChange} value={formik.values.email} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.email ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.email ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder='อีเมล *'
                    />
                    <p className='text-red-500 text-sm'>{formik.errors.email}</p>
                </label>
                </>
                }

                {!forgotPassword && (
                    <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                        <SfInput name="pwd" type='password' autoComplete="given-password" onChange={formik.handleChange} value={formik.values.pwd} 
                            wrapperClassName={`!bg-neutral-50 ${formik.errors.pwd ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                            className={`bg-neutral-50 font-medium ${formik.errors.pwd ? 'text-red-500' : 'text-darkgray'} `}
                            placeholder="รหัสผ่าน *"
                        />
                        <p className='text-red-500 text-sm'>{formik.errors.pwd}</p>
                    </label>
                )}

                {loginState == false && 
                <>
                <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                    <SfInput name="pwd_confirm" type='password' autoComplete="given-password" onChange={formik.handleChange} value={formik.values.pwd_confirm} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.pwd_confirm ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.pwd_confirm ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder="ยืนยันรหัสผ่าน *"
                    />
                    <p className='text-red-500 text-sm'>{formik.errors.pwd_confirm}</p>
                </label>
                <div className="mb-7 text-sm text-secgray">
                    ฉันยอมรับ <SfLink href="#" className='text-linkblack no-underline'>ข้อตกลงและเงื่อนไข</SfLink> รวมถึงการประมวลผลข้อมูลของฉันตามจุดประสงค์ดังที่ระบุไว้ใน <SfLink href="#" className='text-linkblack no-underline'>นโยบายความเป็นส่วนตัวและการใช้งานคุ้กกี้</SfLink>
                </div>
                </>
                }

                {loginState ? (
                    <>{forgotPassword ? (
                        <div className="w-full flex mt-6 gap-3">
                            <SfButton variant='tertiary' className={`btn-primary rounded-xl h-[50px] ${loginState === false ? 'w-full' : ''}`} type='submit'>{isLoading ? 'Loading...' : 'ยืนยัน'}</SfButton>
                            <SfButton variant='tertiary' className={`btn-secondary rounded-xl h-[50px] ${loginState === false ? 'w-full' : ''}`} onClick={handleForgotPass}>{isLoading ? 'Loading...' : `ยกเลิก`}</SfButton>
                        </div>
                    ) : (
                        <div className="w-full flex mt-6 gap-3">
                            <SfButton variant='tertiary' className={`btn-primary rounded-xl h-[50px] ${loginState === false ? 'w-full' : ''}`} type='submit'>{isLoading ? 'Loading...' : 'เข้าสู่ระบบ'}</SfButton>
                            <SfButton variant='tertiary' className={`btn-secondary rounded-xl h-[50px] ${loginState === false ? 'w-full' : ''}`} onClick={handleForgotPass}>{isLoading ? 'Loading...' : `ลืมรหัสผ่าน`}</SfButton>
                        </div>
                    )}</>
                ) : (
                    <SfButton variant='tertiary' className={`btn-primary rounded-xl h-[50px] w-full`} type='submit'>{isLoading ? 'Loading...' : 'ลงทะเบียน'}</SfButton>
                )}
                {loginState === false && (
                    <>
                    <p className='text-secgray'>หากเป็นสมาชิกอยู่แล้ว คลิกที่นี่เพื่อเข้าสู่ระบบ</p>
                    <SfButton variant='tertiary' className='btn-secondary h-[50px] rounded-xl w-full text-black shadow-none font-semibold' onClick={handleLoginState}>
                        เข้าสู่ระบบ
                    </SfButton>
                    </>
                )}
            </form>
            {loginState === true ? (
                <div className='flex flex-col gap-y-5'>
                    <h2 className="text-darkgray text-2xl font-semibold">ลูกค้าใหม่</h2>
                    <p className='text-secgray'>ลงทะเบียนเพื่อเข้าถึง การสินค้าสุดพิเศษพร้อมกับสินค้ามาใหม่ เทรนด์ที่มาแรง ส่วนลดและโปรโมชั่นมากมายสำหรับสมาชิก</p>
                    <SfButton className='w-fit mt-5 btn-primary h-[50px] rounded-xl' onClick={handleLoginState}>
                        สมัครสมาชิก
                    </SfButton>
                </div>
            ) : null}
            </section>
        </main>

        <CSSTransition
            in={isOpen}
            nodeRef={backdropRef}
            timeout={200}
            unmountOnExit
            classNames={{
            enter: 'opacity-0',
            enterDone: 'opacity-100 transition duration-200 ease-out',
            exitActive: 'opacity-0 transition duration-200 ease-out',
            }}
        >
            <div ref={backdropRef} className="fixed inset-0 bg-neutral-700 bg-opacity-50 z-99" />
        </CSSTransition>
        <CSSTransition
            in={isOpen}
            nodeRef={modalRef}
            timeout={200}
            unmountOnExit
            classNames={{
            enter: 'translate-y-10 opacity-0',
            enterDone: 'translate-y-0 opacity-100 transition duration-200 ease-out',
            exitActive: 'translate-y-10 opacity-0 transition duration-200 ease-out',
            }}
        >
            <SfModal
                open
                onClose={close}
                ref={modalRef}
                as="section"
                role="alertdialog"
                className="max-w-[90%] md:max-w-[456px] z-100 flex flex-col gap-y-8 items-center text-center !p-8"
            >
                <div className='p-3 bg-black rounded-full w-fit'>
                    <Icons.check color='white'/>
                </div>

                <div className='flex flex-col gap-y-6'>
                    <h1 className='text-black text-2xl font-semibold'>ลงทะเบียนสำเร็จ</h1>
                    <p className='text-darkgray'>ขอบคุณสำหรับการสมัครสมาชิก คุณสามารถตรวจสอบข้อมูลส่วนตัวของคุณได้ที่ “รายละเอียดบัญชี”</p>
                </div>

                <SfButton className='w-full btn-primary h-[50px] rounded-xl' onClick={() => navigate('/home/all items')}>
                    เริ่มต้นการใช้งาน
                </SfButton>
            </SfModal>
        </CSSTransition>
        </>
    );
}