import { useFormik } from "formik";
import { SfInput, SfButton } from "@storefront-ui/react";
import { useUser } from '../../hooks/useUser';
import { useFrappePostCall } from 'frappe-react-sdk';

export default function MyAccountForm(onSuccess = () => { },){
  const { user, logout } = useUser();
  const { call, isCompleted } = useFrappePostCall('webshop.webshop.api.update_profile')
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: user?.user?.first_name || "",
      last_name: user?.user?.last_name || "",
      email: user?.user?.email || "",
    },
    // validationSchema: addressSchema,
    // validateOnChange: false,
    onSubmit: call
  });

  console.log("Formik Values:", formik.values);

  return (
    <form className="max-w-[950px] flex gap-x-4 gap-y-3 flex-wrap text-neutral-900" onSubmit={formik.handleSubmit}>
    <h2 className="w-full font-bold text-basesm">ข้อมูลส่วนตัว</h2>
    <div className='w-full'>
      <label>
          <SfInput
              name="first_name"
              className="text-basesm bg-neutral-50 font-medium text-darkgray"
              wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
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
          <SfInput
              name="last_name"
              className="text-basesm bg-neutral-50 font-medium text-darkgray"
              wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
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
          <SfInput
              name="email"
              className="text-basesm bg-neutral-50 font-medium text-darkgray"
              wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
              onChange={formik.handleChange}
              readOnly
              value={formik.values.email}
              invalid={formik.errors.email}
          />
        </label>
        {formik.errors.email && (
            <strong className="typography-error-sm text-negative-700 font-medium">Email is required</strong>
        )}
    </div>

    <div className="w-full">
        <SfButton type='submit' className="w-full btn-primary text-base h-[50px] rounded-xl mt-3">อัพเดทข้อมูล</SfButton>
    </div>
</form>
  )
}