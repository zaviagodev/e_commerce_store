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
    const navigate = useNavigate();
    const {
        currentUser,
        isLoading,
    } = useFrappeAuth();

    const getValidationSchema = () => {
        let schema = {
            usr: Yup.string()
            .min(3, 'Must be 3 characters or more')
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
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
            usr: 'Administrator',
            email: '',
            pwd: 'toor',
            pwd_confirm: ''
        },
        validationSchema: getValidationSchema(),
        onSubmit: (values) => {
            if (loginState == false) {
                register(values.usr,values.email , values.pwd).then((data) => data.message == 'Logged In' && navigate("/home/all items"))
            }else{
                login(values.usr, values.pwd ).then((data) => data.message == 'Logged In' && navigate("/home/all items"));
            }
        }
    });


    useEffect(() => {
        console.log(getToken(), currentUser);
        if (getToken() || currentUser) {
            navigate("/home/all items");
        }
        if(loginState || !loginState){
            formik.validateForm();
        }
       
    }, [navigate, currentUser,  loginState, ])


    const handleLoginState = () => {
        setLoginState(!loginState);
    }



    return (
        <>
        <form className="p-4 flex gap-4 flex-wrap text-neutral-900 text-start text-big" onSubmit={formik.handleSubmit}>
            <h2 className="w-full typography-headline-4 md:typography-headline-3 font-bold">{loginState ? 'Sign in' : 'Register'}</h2>
            <label className="w-full flex flex-col gap-0.5">
                <span className="typography-text-sm  font-medium">usr/username</span>
                <SfInput name="usr" autoComplete="usr" required onChange={formik.handleChange} value={formik.values.usr} />
                {formik.errors.usr}
            </label>
            {loginState == false &&  <label className="w-full flex flex-col gap-0.5">
                <span className="typography-text-sm  font-medium">email</span>
                <SfInput name="email" autoComplete="email" required onChange={formik.handleChange} value={formik.values.email} />
                {formik.errors.email}
            </label>}
            <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                <span className="typography-text-sm font-medium">password</span>
                <SfInput name="pwd" type='password' autoComplete="given-password" required onChange={formik.handleChange} value={formik.values.pwd} />
                {formik.errors.pwd}
            </label>
            {loginState == false && 
            <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                <span className="typography-text-sm font-medium">confirm password</span>
                <SfInput name="pwd_confirm" type='password' autoComplete="given-password" required onChange={formik.handleChange} value={formik.values.pwd_confirm} />
                {formik.errors.pwd_confirm}
             </label>
            }


            <div className="w-full flex gap-4 mt-4 md:mt-0">
                <SfButton disabled={!formik.isValid} className="w-full" type='submit'>{isLoading ? 'Loading...' : `${loginState ? 'login' : 'register'}`}</SfButton>
            </div>
            <div className='w-full flex items-center justify-center'>
                {loginState ? <span >D'ont have an account ? : <a onClick={handleLoginState} href="#login">register</a></span> : <span >Already have an account ? : <a onClick={handleLoginState} href="#register">login</a></span> }
            </div>
        </form>
        </>
    );
}
