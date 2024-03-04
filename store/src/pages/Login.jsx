import { SfInput, SfButton, SfLink, SfModal, useDisclosure, SfLoaderCircular } from '@storefront-ui/react';
import { useFormik } from 'formik';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getToken } from '../utils/helper';
import * as Yup from 'yup';
import { Icons } from '../components/icons';
import Modal from '../components/drawers/Modal';

export default function Login() {
    const { login } = useUser();
    const [loginState, setLoginState] = useState(true);
    const [apiResponse, setapiResponse] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [forgotPassword, setForgotPassword] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const { isOpen:isForgotPassSubmitted, open:openSubmittedForgotPass, close:closeSubmittedForgotPass } = useDisclosure({ initialValue: false });

    const navigate = useNavigate();
    const {
        currentUser,
        isLoading,
        error
    } = useFrappeAuth();

    const getValidationSchema = () => {
        let schema = {};

        if (forgotPassword){schema['email'] = Yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('จำเป็นต้องกรอกอีเมล');}
        schema['usr'] = Yup.string().equals([Yup.ref('usr')], 'enter username').required('จำเป็นต้องกรอกข้อมูล');
        schema['pwd'] = Yup.string().equals([Yup.ref('pwd')], 'Passwords must match').required('จำเป็นต้องกรอกรหัสผ่าน');
        return Yup.object().shape(schema);
    };

    const formik = useFormik({
        initialValues: {
            usr: '',
            pwd: '',
            email: ''
        },
        validationSchema: getValidationSchema(),
        onSubmit: (values) => {
            setSaveLoading(true)
            login(values.usr, values.pwd ).then((data) => {
                if(data.message == 'Logged In' || data.message == 'No App'){
                    navigate("/home/all items")
                } else if(data.message == 'Invalid login credentials'){
                    setapiResponse('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
                    setSaveLoading(false)
                } else {
                    setapiResponse(data.message);
                    setSaveLoading(false)
                }
            });
        }
    });

    useEffect(() => {
        if (getToken() || currentUser) {
            navigate("/home/all items");
        }
        // formik.validateForm();
    }, [ currentUser ]) // Removed 'loginState' because the modal won't show after registered

    const handleForgotPass = (e) => {
        e.preventDefault()
        setForgotPassword(!forgotPassword)
    }

    const confirmEmailForgotPass = () => {
        if (formik.errors.email === undefined && formik.values.email !== ""){
            openSubmittedForgotPass()
        }
    }

    return (
        <>
        <main className='main-section-login'>
        <h2 className="mb-[41px] lg:mb-[85px] text-primary text-center text-2xl lg:text-4xl font-semibold">เข้าสู่ระบบ</h2>
            <section className={`max-w-[410px] w-full lg:max-w-none grid grid-cols-1 gap-[70px] mx-auto lg:grid-cols-2`}>
            <form className="flex gap-3 flex-wrap text-neutral-900 text-start text-big" onSubmit={formik.handleSubmit}>
                <h2 className="text-darkgray text-lg lg:text-2xl font-semibold">{forgotPassword ? 'รีเซ็ตรหัสผ่านของคุณ' : 'ลงชื่อเข้าใช้งาน'}</h2>
                {forgotPassword && (
                    <p className='text-secgray'>เราจะส่งข้อมูลไปยังอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน</p>
                )}

                {apiResponse == 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' && <h2 className="text-xs text-red-500 font-semibold w-full">{apiResponse}</h2>}

                <label className="w-full flex flex-col">
                    <SfInput name={forgotPassword ? "email" : "usr"} autoComplete={forgotPassword ? "email" : "usr"} onChange={formik.handleChange} value={forgotPassword ? formik.values.email : formik.values.usr} 
                        wrapperClassName={`!bg-neutral-50 ${(forgotPassword ? formik.errors.email : formik.errors.usr) ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${(forgotPassword ? formik.errors.email : formik.errors.usr) ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder='อีเมล *'
                    />
                    <p className='text-red-500 text-xs font-semibold mt-2'>{forgotPassword ? formik.errors.email : formik.errors.usr}</p>
                </label>

                {!forgotPassword && (
                    <label className="w-full flex flex-col">
                        <SfInput name="pwd" type={showPassword ? 'text' : 'password'} autoComplete="given-password" onChange={formik.handleChange} value={formik.values.pwd} 
                            wrapperClassName={`!bg-neutral-50 ${formik.errors.pwd ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                            className={`bg-neutral-50 font-medium ${formik.errors.pwd ? 'text-red-500' : 'text-darkgray'} `}
                            placeholder="รหัสผ่าน *"
                            slotSuffix={<a onClick={() => setShowPassword(!showPassword)} className='cursor-pointer'>{showPassword ? <Icons.eye /> : <Icons.eyeOff />}</a>}
                        />
                        <p className='text-red-500 text-xs font-semibold mt-2'>{formik.errors.pwd}</p>
                    </label>
                )}

                {forgotPassword ? (
                    <div className="w-full flex mt-6 gap-3">
                        <SfButton variant='tertiary' className={`btn-primary rounded-xl h-[50px] ${loginState === false ? 'w-full' : 'w-[100px]'} ${saveLoading ? '!bg-[#F3F3F3]' : ''}`} type='submit' onClick={confirmEmailForgotPass} disabled={saveLoading}>{saveLoading ? <SfLoaderCircular /> : 'ยืนยัน'}</SfButton>
                        <SfButton variant='tertiary' className={`btn-secondary rounded-xl h-[50px] ${loginState === false ? 'w-full' : 'w-[120px]'} ${saveLoading ? '!bg-[#F3F3F3]' : ''}`} onClick={handleForgotPass} disabled={saveLoading}>{saveLoading ? <SfLoaderCircular /> : `ยกเลิก`}</SfButton>
                    </div>
                ) : (
                    <div className="w-full flex mt-6 gap-3">
                        <SfButton variant='tertiary' className={`btn-primary rounded-xl h-[50px] ${loginState === false ? 'w-full' : 'w-[100px]'} ${saveLoading ? '!bg-[#F3F3F3]' : ''}`} type='submit' disabled={saveLoading}>{saveLoading ? <SfLoaderCircular /> : 'เข้าสู่ระบบ'}</SfButton>
                        <SfButton variant='tertiary' className={`btn-secondary rounded-xl h-[50px] ${loginState === false ? 'w-full' : 'w-[120px]'} ${saveLoading ? '!bg-[#F3F3F3]' : ''}`} onClick={handleForgotPass} disabled={saveLoading}>{saveLoading ? <SfLoaderCircular /> : `ลืมรหัสผ่าน`}</SfButton>
                    </div>
                )}
            </form>
            <div className='flex flex-col gap-y-5'>
                <h2 className="text-darkgray text-lg lg:text-2xl font-semibold">ลูกค้าใหม่</h2>
                <p className='text-secgray'>สมัครสมาชิกเพื่อซื้อสินค้าที่คุณชื่นชอบ ผ่านระบบการชำระเงินที่สะดวกรวดเร็ว</p>
                <Link to='/register' className='w-fit'>
                    <SfButton className='w-fit mt-5 btn-primary h-[50px] rounded-xl'>
                        สมัครสมาชิก
                    </SfButton>
                </Link>
            </div>
            </section>
        </main>

        <Modal isOpen={isForgotPassSubmitted} close={closeSubmittedForgotPass} open={openSubmittedForgotPass}>
            <div className='bg-black rounded-full h-[53px] w-[53px] flex items-center justify-center'>
                <Icons.check color='white' className='w-6 h-6'/>
            </div>
            <div className='flex flex-col gap-y-6'>
                <h1 className='text-black text-2xl font-semibold'>ส่งข้อมูลไปยังอีเมลเรียบร้อยแล้ว</h1>
                <p className='text-darkgray'>เราได้ส่งข้อมูลเกี่ยวกับการรีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรีนยร้อยแล้ว </p>
            </div>

            <div className='flex gap-x-3 w-full'>
            <SfButton variant='tertiary' className='w-full btn-primary h-[50px] rounded-xl' onClick={closeSubmittedForgotPass}>
                ยืนยัน
            </SfButton>
            </div>
        </Modal>
        </>
    );
}