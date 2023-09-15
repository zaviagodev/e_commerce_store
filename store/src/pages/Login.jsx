import { SfInput, SfButton } from '@storefront-ui/react';
import { useFormik } from 'formik';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getToken } from '../utils/helper';

export default function Login() {
    const { login } = useUser();
    const navigate = useNavigate();
    const {
        currentUser,
        isLoading,
    } = useFrappeAuth();

    useEffect(() => {
        if (getToken() || currentUser) {
            navigate("/");
        }
    }, [navigate, currentUser])

    const formik = useFormik({
        initialValues: {
            // usr: 'umer2001.uf@gmail.com',
            // pwd: 'admintoor',
            usr: 'suttirak.ch@zaviago.com',
            pwd: 'CanDoNa12a3',
        },
        onSubmit: values => login(values.usr, values.pwd).then(() => navigate("/"))
    });


    return (
        <form className="p-4 flex gap-4 flex-wrap text-neutral-900 text-start" onSubmit={formik.handleSubmit}>
            <h2 className="w-full typography-headline-4 md:typography-headline-3 font-bold">Sign in</h2>
            <label className="w-full flex flex-col gap-0.5">
                <span className="typography-text-sm  font-medium">usr/username</span>
                <SfInput name="usr" type='email' autoComplete="usr" required onChange={formik.handleChange} value={formik.values.usr} />
            </label>
            <label className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                <span className="typography-text-sm font-medium">password</span>
                <SfInput name="pwd" type='password' autoComplete="given-password" required onChange={formik.handleChange} value={formik.values.pwd} />
            </label>


            <div className="w-full flex gap-4 mt-4 md:mt-0">
                <SfButton className="w-full" type='submit'>{isLoading ? 'Loading...' : 'login'}</SfButton>
            </div>
        </form>
    );
}
