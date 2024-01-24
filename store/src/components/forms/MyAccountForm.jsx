import { useFormik } from "formik";
import { SfInput, SfButton } from "@storefront-ui/react";
import { useUser } from '../../hooks/useUser';



export default function MyAccountForm(onSuccess = () => { },){
  const { user, logout } = useUser();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    // validationSchema: addressSchema,
    // validateOnChange: false,
    // onSubmit: call
  });

  return (
    <form className="max-w-[950px] flex gap-x-4 gap-y-8 flex-wrap text-neutral-900" onSubmit={formik.handleSubmit}>
    {/* <h2 className="w-full typography-headline-4 md:typography-headline-3 font-bold">Billing address</h2> */}
    <div className='w-full'>
      <label>
          <span className="text-sm font-medium mb-2 block">First name <span className='text-red-500'>*</span></span>
          <SfInput
              name="first_name"
              className="mt-0.5 text-sm"
              onChange={formik.handleChange}
              value={formik.values.first_name}
              invalid={formik.errors.first_name}
          />
        </label>
        {formik.errors.first_name && (
            <strong className="typography-error-sm text-negative-700 font-medium">First name is required</strong>
        )}
    </div>

    <div className='w-full'>
      <label>
          <span className="text-sm font-medium mb-2 block">Last name <span className='text-red-500'>*</span></span>
          <SfInput
              name="last_name"
              className="mt-0.5 text-sm"
              onChange={formik.handleChange}
              value={formik.values.last_name}
              invalid={formik.errors.last_name}
          />
        </label>
        {formik.errors.last_name && (
            <strong className="typography-error-sm text-negative-700 font-medium">Last name is required</strong>
        )}
    </div>
    
    <div className='w-full'>
      <label>
          <span className="text-sm font-medium mb-2 block">Email <span className='text-red-500'>*</span></span>
          <SfInput
              name="email"
              className="mt-0.5 text-sm"
              onChange={formik.handleChange}
              value={formik.values.email}
              invalid={formik.errors.email}
          />
        </label>
        {formik.errors.email && (
            <strong className="typography-error-sm text-negative-700 font-medium">Email is required</strong>
        )}
    </div>

    <div className='w-full'>
      <label>
          <span className="text-sm font-medium mb-2 block">Phone <span className='text-red-500'>*</span></span>
          <SfInput
              name="phone"
              className="mt-0.5 text-sm"
              onChange={formik.handleChange}
              value={formik.values.phone}
              invalid={formik.errors.phone}
          />
        </label>
        {formik.errors.phone && (
            <strong className="typography-error-sm text-negative-700 font-medium">Phone is required</strong>
        )}
    </div>

    <div className="w-full flex gap-4 mt-4 md:mt-0 md:justify-start">
        <SfButton type='submit' className="w-full md:w-auto btn-primary text-sm">Update profile</SfButton>
    </div>
</form>
  )
}