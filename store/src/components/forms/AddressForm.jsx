import { useEffect, useState } from 'react';
import { SfSelect, SfInput, SfCheckbox, SfButton } from '@storefront-ui/react';
import { useFormik } from 'formik';
import { useFrappePostCall } from 'frappe-react-sdk';
import { addressSchema } from './addressFormSchema';
import { Skeleton } from '../Skeleton';

// Here you should provide a list of countries you want to support
// or use an up-to-date country list like: https://www.npmjs.com/package/country-list
const countries = ['Thailand', 'Pakistan', 'Germany', 'Great Britain', 'Poland', 'United States of America'];
// const states = ['Sindh', 'Punjab', 'Balochistan', 'KPK', 'Florida', 'New York', 'Texas', 'Frankfurt', 'Berlin'];
const states = ['กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กำแพงเพชร','ขอนแก่น','จันทบุรี','ฉะเชิงเทรา', 'นครปฐม', 'นครพนม', 'นนทบุรี', 'ปทุมธานี', 'พระนครศรีอยุธยา' ,'ชลบุรี','ตราด','ปราจีนบุรี','เพชรบุรี','ราชบุรี','ระยอง','สมุทรปราการ','สมุทรสาคร','สมุทรสงคราม', 'อุดรธานี', 'หนองคาย', 'หนองบัวลำภู', 'อุบลราชธานี', 'อุทัยธานี', 'อ่างทอง']

const AddressForm = ({ onFormSubmit }) => {
    const { call, isCompleted } = useFrappePostCall('headless_e_commerce.api.add_address')
    const [isSaving, setIsSaving] = useState(false)
    const formik = useFormik({
        initialValues: {
            address_title: "",
            phone: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            is_primary_address: 1,
            is_shipping_address: 0,
        },
        validationSchema: addressSchema,
        validateOnChange: false,
    });

    const CreateNewAddress = (e) => {
        console.log(e);
        e.preventDefault()
        setIsSaving(true)
        formik.validateForm()
        //if(!formik.isValid){
            call(formik.values).then((data) => {
                onFormSubmit(data);
                setIsSaving(false)
            });
        //}
    }

    return (
        <form className="max-w-[950px] flex gap-3 flex-wrap text-neutral-900" >
            {/* <h2 className="w-full typography-headline-4 md:typography-headline-3 font-bold">Billing address</h2> */}
            <div className="w-full flex-grow flex flex-col gap-0.5">
                <label>
                    {/* <span className="text-sm font-medium mb-2 block">Name <span className='text-red-500'>*</span></span> */}
                    <SfInput
                        name="address_title"
                        wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px]'
                        className="text-basesm bg-neutral-50 font-medium text-darkgray"
                        onChange={formik.handleChange}
                        value={formik.values.address_title}
                        invalid={formik.errors.address_title}
                        placeholder='ชื่อ-นามสกุล *'
                        disabled={isSaving}
                    />
                </label>
                {formik.errors.address_line1 && (
                    <strong className="typography-error-sm text-negative-700 font-medium">Please provide a street name</strong>
                )}
            </div>
            <div className="w-full flex flex-col gap-0.5">
                <label>
                    {/* <span className="text-sm font-medium mb-2 block">Phone <span className='text-red-500'>*</span></span> */}
                    <SfInput placeholder='เบอร์โทร *' disabled={isSaving} name="phone" className="text-basesm bg-neutral-50 font-medium text-darkgray" wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px]' onChange={formik.handleChange} value={formik.values.phone} />
                </label>
            </div>
            <div className="w-full flex-grow flex flex-col gap-0.5">
                <label>
                    {/* <span className="text-sm font-medium mb-2 block">Address line 1 <span className='text-red-500'>*</span></span> */}
                    <SfInput
                        name="address_line1"
                        className="text-basesm bg-neutral-50 font-medium text-darkgray"
                        wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px]'
                        onChange={formik.handleChange}
                        value={formik.values.address_line1}
                        invalid={formik.errors.address_line1}
                        placeholder='ที่อยู่ 1 *'
                        disabled={isSaving}
                    />
                </label>
                {formik.errors.address_line1 && (
                    <strong className="typography-error-sm text-negative-700 font-medium">Please provide a street name</strong>
                )}
            </div>
            <div className="w-full flex flex-col gap-0.5">
                <label>
                    {/* <span className="text-sm font-medium mb-2 block">Address line 2</span> */}
                    <SfInput name="address_line2" placeholder='ที่อยู่ 2' className="text-basesm bg-neutral-50 font-medium text-darkgray" disabled={isSaving} wrapperClassName='!bg-neutral-50 h-[50px] !ring-lightgray' onChange={formik.handleChange} value={formik.values.address_line2} />
                </label>
            </div>
            <div className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                <label>
                    {/* <span className="text-sm font-medium mb-2 block">Country <span className='text-red-500'>*</span></span> */}
                    <SfSelect name="country" className='text-basesm h-[50px] !ring-lightgray font-medium text-darkgray' disabled={isSaving} wrapperClassName='!bg-neutral-50' placeholder="ประเทศ" onChange={formik.handleChange} value={formik.values.country} invalid={formik.errors.country}>
                        {countries.map((countryName) => (
                            <option key={countryName} value={countryName}>{countryName}</option>
                        ))}
                    </SfSelect>
                </label>
                {formik.errors.country && (
                    <strong className="typography-error-sm text-negative-700 font-medium">{formik.errors.country}</strong>
                )}
            </div>

            <div className="w-full flex flex-col gap-0.5">
                <label>
                    {/* <span className="text-sm font-medium mb-2 block">City <span className='text-red-500'>*</span></span> */}
                    <SfInput name="city" className='text-basesm bg-neutral-50 font-medium text-darkgray' disabled={isSaving} wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px]' placeholder="เขต / อำเภอ" onChange={formik.handleChange} value={formik.values.city} invalid={formik.errors.city} />
                </label>
                {formik.errors.city && (
                    <strong className="typography-error-sm text-negative-700 font-medium">{formik.errors.city}</strong>
                )}
            </div>

            <div className='w-full flex flex-col gap-3 md:flex-row md:justify-between'>
                <label className="w-full flex flex-col gap-0.5 flex-grow">
                    {/* <span className="text-sm font-medium mb-2 block">State</span> */}
                    <SfSelect name="state" className='text-basesm h-[50px] !ring-lightgray font-medium text-darkgray' disabled={isSaving} wrapperClassName='!bg-neutral-50' placeholder="จังหวัด" onChange={formik.handleChange} value={formik.values.state}>
                        {states.map((stateName) => (
                            <option key={stateName} value={stateName}>{stateName}</option>
                        ))}
                    </SfSelect>
                </label>
                <div className="w-full flex flex-col gap-0.5">
                    <label>
                        {/* <span className="text-sm font-medium mb-2 block">Postal code</span> */}
                        <SfInput name="pincode" className='text-basesm bg-neutral-50 font-medium text-darkgray' disabled={isSaving} wrapperClassName='!bg-neutral-50 !ring-lightgray h-[50px]' placeholder='รหัสไปรษณีย์ *' onChange={formik.handleChange} value={formik.values.pincode} />
                    </label>
                </div>
            </div>

            {/* <label className="w-full flex items-center gap-2">
                <SfCheckbox
                    name="is_shipping_address"
                    onChange={e => formik.setFieldValue('is_shipping_address', e.target.checked ? 1 : 0)}
                    checked={formik.values.is_shipping_address === 1 ? true : false} />
                Use as shipping address
            </label> */}

            <div className="w-full flex gap-3 mt-3">
                {/* <SfButton type="reset" variant='tertiary' className="w-full md:w-auto btn-secondary text-sm" onClick={formik.handleReset}>
                    Clear all
                </SfButton> */}

                {!isSaving ? <SfButton  className="w-full h-[50px] btn-primary text-base" onClick={CreateNewAddress}>บันทึกที่อยู่</SfButton> : <Skeleton className='h-[50px] w-full'/>}
            </div>
        </form>
    )
}

export default AddressForm;