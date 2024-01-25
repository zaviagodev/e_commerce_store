import { SfInput, SfButton } from '@storefront-ui/react';
import { useFormik } from 'formik';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getToken } from '../utils/helper';
import * as Yup from 'yup';

export default function Login() {
    const { login, register } = useUser();
    const [loginState, setLoginState] = useState(true);
    const [apiResponse, setapiResponse] = useState('');

    const navigate = useNavigate();
    const {
        currentUser,
        isLoading,
    } = useFrappeAuth();

    const getValidationSchema = () => {
        let schema = {
            pwd: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
        };
        if (!loginState) {
            schema['email'] = Yup.string().email('Invalid email address').required('Required');
            schema['pwd_confirm'] = Yup.string().equals([Yup.ref('pwd')], 'Passwords must match').required('Required');
        }
        return Yup.object().shape(schema);
    };

    const formik = useFormik({
        initialValues: {
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
                        //navigate("/home/all items")
                    }
                    else{
                        setapiResponse(data.message[1]);
                    }
                    
                })

            }else{
                 login(values.usr, values.pwd ).then((data) => {
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
        formik.validateForm();
    }, [ currentUser,  loginState,formik.errors ])

    const handleLoginState = () => {
        setLoginState(!loginState);
        setapiResponse('');
    }

    return (
        <main className='main-section'>
        <h2 className="mb-[85px] text-primary text-center text-4xl font-semibold">{loginState ? 'ลงชื่อเข้าใช้งาน' : 'ลงทะเบียน'}</h2>
            <section className={`grid grid-cols-1 lg:grid-cols-2 gap-x-[70px] mx-auto ${!loginState ? 'w-[410px]' : ''}`}>
            <form className="flex gap-4 flex-wrap text-neutral-900 text-start text-big" onSubmit={formik.handleSubmit}>
                <h2 className="text-darkgray text-2xl font-semibold">{loginState ? 'ลงชื่อเข้าใช้งาน' : 'ลงทะเบียนสมาชิกใหม่'}</h2>

                {apiResponse && <h2 className="mb-4 primary-heading text-primary text-center w-full">{apiResponse}</h2>}

                {loginState == true && 
                    <label className="w-full flex flex-col gap-0.5">
                        <SfInput name="usr" autoComplete="usr" required onChange={formik.handleChange} value={formik.values.usr} 
                            wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
                            className=" bg-neutral-50 font-medium text-darkgray"
                            placeholder='อีเมล'
                        />
                        <p className='text-negative-800 text-sm'>{formik.errors.usr}</p>
                    </label>
                }

                {loginState == false && 
                <label className="w-full flex flex-col gap-0.5">
                    <SfInput name="email" autoComplete="email" required onChange={formik.handleChange} value={formik.values.email} 
                        wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
                        className=" bg-neutral-50 font-medium text-darkgray"
                        placeholder='อีเมล'
                    />
                    <p className='text-negative-800 text-sm'>{formik.errors.email}</p>
                </label>}

                <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                    <SfInput name="pwd" type='password' autoComplete="given-password" required onChange={formik.handleChange} value={formik.values.pwd} 
                        wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
                        className=" bg-neutral-50 font-medium text-darkgray"
                        placeholder="รหัสผ่าน"
                    />
                    <p className='text-negative-800 text-sm'>{formik.errors.pwd}</p>
                </label>

                {loginState == false && 
                <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                    <SfInput name="pwd_confirm" type='password' autoComplete="given-password" required onChange={formik.handleChange} value={formik.values.pwd_confirm} 
                        wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
                        className=" bg-neutral-50 font-medium text-darkgray"
                        placeholder="ยืนยันรหัสผ่าน"
                    />
                    <p className='text-negative-800 text-sm'>{formik.errors.pwd_confirm}</p>
                </label>
                }

                <div className="w-full flex gap-4 mt-4 md:mt-0">
                    <SfButton variant='tertiary' className={`btn-primary rounded-xl h-[50px] ${loginState === false ? 'w-full' : ''}`} type='submit'>{isLoading ? 'Loading...' : `${loginState ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'}`}</SfButton>
                </div>
                {loginState === false && (
                    <SfButton variant='tertiary' className='border border-neutral-100 bg-neutral-50 h-[50px] rounded-xl w-full text-black shadow-none font-semibold' onClick={handleLoginState}>
                        เข้าสู่ระบบ
                    </SfButton>
                )}
                {/* <div className='w-full flex items-center justify-center'>
                    {loginState ? <span >Don't have an account? : <a onClick={handleLoginState} href="#login">register</a></span> : <span >Already have an account? : <a onClick={handleLoginState} href="#register">login</a></span> }
                </div> */}
            </form>
            {loginState === true ? (
                <div className='flex flex-col gap-y-5'>
                    <h2 className="text-darkgray text-2xl font-semibold">ลูกค้าใหม่</h2>
                    <p className='text-secgray'>ลงทะเบียนเพื่อเข้าถึง การสินค้าสุดพิเศษพร้อมกับสินค้ามาใหม่ เทรนด์ที่มาแรง ส่วนลดและโปรโมชั่นมากมายสำหรับสมาชิก</p>
                    <SfButton className='w-fit mt-5 btn-primary h-[50px] rounded-xl' onClick={handleLoginState}>
                        ลงทะเบียน
                    </SfButton>
                </div>
            ) : null}
            </section>
        </main>
    );
}
