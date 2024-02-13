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

export default function Register() {
    const { register } = useUser();
    const [apiResponse, setapiResponse] = useState('');
    const [saveLoading, setSaveLoading] = useState(false)

    const { isOpen, open:openRegisteredModal, close } = useDisclosure({ initialValue: false });

    const navigate = useNavigate();
    const {
        currentUser,
        isLoading,
        error
    } = useFrappeAuth();

    const getValidationSchema = () => {
        let schema = {};

        schema['pwd'] = Yup.string().equals([Yup.ref('pwd_confirm')], 'รหัสผ่านไม่ตรงกัน').required('จำเป็นต้องกรอกรหัสผ่าน');
        schema['pwd_confirm'] = Yup.string().equals([Yup.ref('pwd')], 'รหัสผ่านไม่ตรงกัน').required('จำเป็นต้องกรอกรหัสผ่าน');
        // schema['first_name'] = Yup.string().required('จำเป็นต้องกรอกข้อมูล');
        // schema['last_name'] = Yup.string().required('จำเป็นต้องกรอกข้อมูล');
        schema['email'] = Yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('จำเป็นต้องกรอกข้อมูล');
        return Yup.object().shape(schema);
    };

    const formik = useFormik({
        initialValues: {
            // first_name:'',
            // last_name:'',
            // usr: '',
            email: '',
            pwd: '',
            pwd_confirm: ''
        },
        validationSchema: getValidationSchema(),
        onSubmit: (values) => {
            setSaveLoading(true)
            register(values.email,values.pwd).then((data) => {
                if(data.message.message == 'Logged In'){
                    setapiResponse('Registered successfully, Please Login');
                    openRegisteredModal()
                    //navigate("/home/all items")
                }
                else{
                    setapiResponse(data.message[1]);
                    setSaveLoading(false)
                } 
            })
        }
    });

    const validRegister = Object.keys(formik.errors).length > 0

    useEffect(() => {
        if (getToken() || currentUser) {
            navigate("/home/all items");
        }
        // formik.validateForm();
    }, [ currentUser ])

    return (
        <>
        <main className='main-section-login'>
        <h2 className="mb-[41px] lg:mb-[85px] text-primary text-center text-2xl lg:text-4xl font-semibold">สมัครสมาชิก</h2>
            <section className={`grid grid-cols-1 gap-[70px] mx-auto max-w-[410px] w-full`}>
            <form className="flex gap-3 flex-wrap text-neutral-900 text-start text-big" onSubmit={formik.handleSubmit}>
                <h2 className="text-darkgray text-lg lg:text-2xl font-semibold">ลงทะเบียนสมาชิกใหม่</h2>

                {apiResponse == 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' && <h2 className="text-xs text-red-500 font-semibold w-full">{apiResponse}</h2>}

                {/* <label className="w-full flex flex-col gap-2">
                    <SfInput name="first_name" autoComplete="first_name" onChange={formik.handleChange} value={formik.values.first_name} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.first_name ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.first_name ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder='ชื่อ *'
                    />
                    <p className='text-red-500 text-xs font-semibold'>{formik.errors.first_name}</p>
                </label>
                <label className="w-full flex flex-col gap-2">
                    <SfInput name="last_name" autoComplete="last_name" onChange={formik.handleChange} value={formik.values.last_name} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.last_name ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.last_name ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder='นามสกุล *'
                    />
                    <p className='text-red-500 text-xs font-semibold'>{formik.errors.last_name}</p>
                </label> */}
                <label className="w-full flex flex-col">
                    <SfInput name="email" autoComplete="email" onChange={formik.handleChange} value={formik.values.email} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.email || apiResponse === 'Already Registered' ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.email || apiResponse === 'Already Registered' ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder='อีเมล *'
                        onKeyDown={() => apiResponse === 'Already Registered' && setapiResponse('')}
                    />
                    <p className='text-red-500 text-xs font-semibold mt-2'>{apiResponse === 'Already Registered' ? 'อีเมลนี้ได้ทำการสมัครสมาชิกเรียบร้อยแล้ว' : formik.errors.email}</p>
                </label>

                <label className="w-full flex flex-col">
                    <SfInput name="pwd" type='password' autoComplete="given-password" onChange={formik.handleChange} value={formik.values.pwd} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.pwd ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.pwd ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder="รหัสผ่าน *"
                    />
                    <p className='text-red-500 text-xs font-semibold mt-2'>{formik.errors.pwd}</p>
                </label>

                <label className="w-full flex flex-col">
                    <SfInput name="pwd_confirm" type='password' autoComplete="given-password" onChange={formik.handleChange} value={formik.values.pwd_confirm} 
                        wrapperClassName={`!bg-neutral-50 ${formik.errors.pwd_confirm ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                        className={`bg-neutral-50 font-medium ${formik.errors.pwd_confirm ? 'text-red-500' : 'text-darkgray'} `}
                        placeholder="ยืนยันรหัสผ่าน *"
                    />
                    <p className='text-red-500 text-xs font-semibold mt-2'>{formik.errors.pwd_confirm}</p>
                </label>
                <div className="mb-7 text-sm text-secgray">
                    ฉันยอมรับ <SfLink href="#" className='text-linkblack no-underline'>ข้อตกลงและเงื่อนไข</SfLink> รวมถึงการประมวลผลข้อมูลของฉันตามจุดประสงค์ดังที่ระบุไว้ใน <SfLink href="#" className='text-linkblack no-underline'>นโยบายความเป็นส่วนตัวและการใช้งานคุ้กกี้</SfLink>
                </div>

                <SfButton variant='tertiary' className={`btn-primary rounded-xl h-[50px] w-full ${saveLoading || validRegister  ? '!bg-[#F3F3F3]' : ''}`} type='submit' disabled={saveLoading || validRegister}>{saveLoading ? <SfLoaderCircular /> : 'ลงทะเบียน'}</SfButton>

                <div className='flex flex-col gap-y-3 mt-[14px] w-full'>
                    <p className='text-secgray text-sm'>หากเป็นสมาชิกอยู่แล้ว คลิกที่นี่เพื่อเข้าสู่ระบบ</p>
                    <Link to='/login'>
                        <SfButton variant='tertiary' className='btn-secondary h-[50px] rounded-xl w-full text-black shadow-none font-semibold'>
                            เข้าสู่ระบบ
                        </SfButton>
                    </Link>
                </div>
            </form>
            </section>
        </main>

        <Modal isOpen={isOpen} open={openRegisteredModal}>
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
        </Modal>
        </>
    );
}