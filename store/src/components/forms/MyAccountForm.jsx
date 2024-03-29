import { useFormik } from "formik";
import { SfInput, SfButton, SfLoaderCircular } from "@storefront-ui/react";
import { useUser } from '../../hooks/useUser';
import { useFrappePostCall } from 'frappe-react-sdk';
import { Icons } from "../icons";
import Toast from "../Toast";
import { useEffect, useState } from "react";
import defaultAvatar from "../../assets/default-avatar.svg"

export default function MyAccountForm(onSuccess = () => { },){
  const [isSaved, setIsSaved] = useState(false)
  const [isError, setIsError] = useState(false)
  const [preview, setPreview] = useState()
  const { user, logout } = useUser();
  const { call, isCompleted, error, loading } = useFrappePostCall('webshop.webshop.api.update_profile')

  const handleSaved = () => {
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
    }, 5000)
  }

  const handleError = () => {
    setIsError(true)
    setTimeout(() => {
      setIsError(false)
    }, 5000)
  }

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

  function handleChange(e){
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  const editedState = 
    formik.values.first_name !== user?.user?.first_name || 
    formik.values.last_name !== user?.user?.last_name

  useEffect(() => {
    isCompleted && handleSaved()
    error && handleError()
  }, [isCompleted, error])

  return (
    <>
    <form className="max-w-[950px] flex gap-x-4 gap-y-3 flex-wrap text-neutral-900" onSubmit={formik.handleSubmit}>
      <div className='flex items-center gap-x-3 mt-10 mb-2'>
        <img
          className="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none w-[60px] h-[60px] object-cover"
          src={preview ? preview : user?.user?.user_image ? `${import.meta.env.VITE_ERP_URL || ""}${user.user.user_image}` : defaultAvatar}
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
              wrapperClassName={`!bg-neutral-50 ${formik.errors.first_name ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
              className={`bg-neutral-50 font-medium ${formik.errors.first_name ? 'text-red-500' : 'text-darkgray'} `}
              onChange={formik.handleChange}
              value={formik.values.first_name}
              invalid={formik.errors.first_name}
              placeholder="ชื่อ"
            />
          </label>
          {formik.errors.first_name && (
              <strong className="text-xs text-red-500 font-semibold">First name is required</strong>
          )}
      </div>

      <div className='w-full'>
        <label>
            <SfInput
                name="last_name"
                wrapperClassName={`!bg-neutral-50 ${formik.errors.last_name ? '!ring-red-500/50' : '!ring-lightgray'} h-[50px] px-6 rounded-xl`}
                className={`bg-neutral-50 font-medium ${formik.errors.last_name ? 'text-red-500' : 'text-darkgray'} `}
                onChange={formik.handleChange}
                value={formik.values.last_name}
                invalid={formik.errors.last_name}
                placeholder="นามสกุล"
            />
          </label>
          {formik.errors.last_name && (
              <strong className="text-xs text-red-500 font-semibold">Last name is required</strong>
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
              <strong className="text-xs text-red-500 font-semibold">Email is required</strong>
          )}
      </div>

      <div className="w-full">
          <SfButton type='submit' className="w-full btn-primary text-base h-[50px] rounded-xl mt-3" disabled={!editedState || loading}>
            {loading ? <SfLoaderCircular /> : 'อัปเดตข้อมูล'}
          </SfButton>
      </div>
    </form>
    <Toast isOpen={isSaved}>
      <div className="flex items-start gap-x-[18px]">
        <Icons.checkCircle />
        <div className="flex flex-col gap-y-4">
          <h3 className="text-baselg leading-3 font-medium">อัปเดตข้อมูล</h3>
          <p className="text-secgray  leading-[10px]">อัปเดตข้อมูลเรียบร้อยแล้ว</p>
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

    <Toast isOpen={isError}>
      <div className="flex items-start gap-x-[18px]">
        <Icons.xcircle color="#EF4444"/>
        <div className="flex flex-col gap-y-4">
          <h3 className="text-baselg leading-3 font-medium">อัปเดตข้อมูลไม่สำเร็จ</h3>
          <p className="text-secgray  leading-[10px]">เกิดปัญหาในการอัปเดตข้อมูล</p>
        </div>
      </div>
      <SfButton
        variant="tertiary"
        className="btn-primary rounded-xl p-4 text-sm"
        onClick={() => setIsError(false)}
      >
        ยืนยัน
      </SfButton>
    </Toast>
    </>
  )
}