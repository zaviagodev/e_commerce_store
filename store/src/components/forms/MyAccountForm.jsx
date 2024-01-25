import { useFormik } from "formik";
import { SfInput, SfButton } from "@storefront-ui/react";
import { useUser } from '../../hooks/useUser';
import { useFrappePostCall } from 'frappe-react-sdk';
import { Icons } from "../icons";
import Toast from "../Toast";
import { useEffect, useState } from "react";

export default function MyAccountForm(onSuccess = () => { },){
  const [isSaved, setIsSaved] = useState(false)
  const [preview, setPreview] = useState()
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

  // console.log("Formik Values:", formik.values);

  const handleToast = () => {
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
    }, 5000)
  }

  function handleChange(e){
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  const editedState = 
    formik.values.first_name === user?.user?.first_name || 
    formik.values.last_name === user?.user?.last_name

  return (
    <>
    <form className="max-w-[950px] flex gap-x-4 gap-y-3 flex-wrap text-neutral-900" onSubmit={formik.handleSubmit}>
      <div className='flex items-center gap-x-3 mt-10 mb-2'>
        <img
          className="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none w-[60px] h-[60px] object-cover"
          src={preview ? preview : user?.user?.user_image ? `${import.meta.env.VITE_ERP_URL || ""}${user.user.user_image}` : "https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/men_category.png"}
          width="60"
          height="60"
          alt="User Image"
        />
        <label for='file-upload' className='text-darkgray text-base cursor-pointer'>แก้ไขรูปโปรไฟล์</label>
        <input type='file' className='hidden' id='file-upload' onChange={handleChange}/>
      </div>

      <h2 className="w-full font-semibold text-secgray">ข้อมูลส่วนตัว</h2>
      <div className='w-full'>
        <label>
            <SfInput
              name="first_name"
              className=" bg-neutral-50 font-medium text-darkgray"
              wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
              onChange={formik.handleChange}
              value={formik.values.first_name}
              invalid={formik.errors.first_name}
              placeholder="ชื่อ *"
            />
          </label>
          {formik.errors.first_name && (
              <strong className="typography-error-sm text-red-500 font-medium">First name is required</strong>
          )}
      </div>

      <div className='w-full'>
        <label>
            <SfInput
                name="last_name"
                className=" bg-neutral-50 font-medium text-darkgray"
                wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
                onChange={formik.handleChange}
                value={formik.values.last_name}
                invalid={formik.errors.last_name}
                placeholder="นามสกุล"
            />
          </label>
          {formik.errors.last_name && (
              <strong className="typography-error-sm text-red-500 font-medium">Last name is required</strong>
          )}
      </div>

      <div className='w-full'>
        <label>
            <SfInput
                name="email"
                className=" bg-neutral-50 font-medium text-secgray"
                wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px] px-6 rounded-xl'
                onChange={formik.handleChange}
                readOnly
                value={formik.values.email}
                invalid={formik.errors.email}
            />
          </label>
          {formik.errors.email && (
              <strong className="typography-error-sm text-red-500 font-medium">Email is required</strong>
          )}
      </div>

      <div className="w-full">
          <SfButton type='submit' className="w-full btn-primary text-base h-[50px] rounded-xl mt-3" disabled={editedState}>อัพเดทข้อมูล</SfButton>
      </div>
  </form>
    <Toast isOpen={isSaved}>
      <div className="flex items-start gap-x-[18px]">
        <Icons.checkCircle />
        <div className="flex flex-col gap-y-4">
          <h3 className="text-baselg leading-3 font-medium">อัพเดทข้อมูล</h3>
          <p className="text-secgray  leading-[10px]">อัพเดทข้อมูลเรียบร้อยแล้ว</p>
        </div>
      </div>
      <SfButton
        variant="tertiary"
        className="btn-primary rounded-xl p-4 text-sm"
        onClick={() => setIsSaved(false)}
      >
        ยืนยัน
      </SfButton>
  </Toast>
    </>
  )
}