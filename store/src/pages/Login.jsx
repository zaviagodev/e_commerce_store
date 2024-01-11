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
            .max(40, 'Must be 40 characters or less')
            .email('Invalid email address')
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
                 register(values.usr,values.email , values.pwd).then((data) => {
                    if(data.message == 'Logged In')
                    {
                        navigate("/home/all items")
                    }
                })

            }else{
                 login(values.usr, values.pwd ).then((data) => {
                    if(data.message == 'Logged In')
                    {
                        navigate("/home/all items")
                    }
                });
            }
        }
    });

    useEffect(() => {
        if (getToken() || currentUser) {
            navigate("/home/all items");
        }
        if(loginState || !loginState){
            formik.validateForm();
        }
    }, [ currentUser,  loginState ])

    const handleLoginState = () => {
        setLoginState(!loginState);
    }

    return (
        <main className='main-section'>
        <form className="flex gap-4 flex-wrap text-neutral-900 text-start text-big" onSubmit={formik.handleSubmit}>
            <h2 className="mb-4 primary-heading text-primary text-center w-full">{loginState ? 'Sign in' : 'Register'}</h2>
            <label className="w-full flex flex-col gap-0.5">
                <span className="typography-text-sm  font-medium">Email</span>
                <SfInput name="usr" autoComplete="usr" required onChange={formik.handleChange} value={formik.values.usr} />
                <p className='text-negative-800 text-sm'>{formik.errors.usr}</p>
            </label>
            {loginState == false &&  <label className="w-full flex flex-col gap-0.5">
                <span className="typography-text-sm  font-medium">Email</span>
                <SfInput name="email" autoComplete="email" required onChange={formik.handleChange} value={formik.values.email} />
                <p className='text-negative-800 text-sm'>{formik.errors.email}</p>
            </label>}
            <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                <span className="typography-text-sm font-medium">Password</span>
                <SfInput name="pwd" type='password' autoComplete="given-password" required onChange={formik.handleChange} value={formik.values.pwd} />
                <p className='text-negative-800 text-sm'>{formik.errors.pwd}</p>
            </label>
            {loginState == false && 
            <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                <span className="typography-text-sm font-medium">Confirm password</span>
                <SfInput name="pwd_confirm" type='password' autoComplete="given-password" required onChange={formik.handleChange} value={formik.values.pwd_confirm} />
                <p className='text-negative-800 text-sm'>{formik.errors.pwd_confirm}</p>
             </label>
            }

            <div className="w-full flex gap-4 mt-4 md:mt-0">
                <SfButton disabled={!formik.isValid} variant='tertiary' className="w-full btn-primary" type='submit'>{isLoading ? 'Loading...' : `${loginState ? 'login' : 'register'}`}</SfButton>
            </div>
            <div className='w-full flex items-center justify-center'>
                {loginState ? <span >Don't have an account? : <a onClick={handleLoginState} href="#login">register</a></span> : <span >Already have an account? : <a onClick={handleLoginState} href="#register">login</a></span> }
            </div>
        </form>
        </main>
    );
}
