import { useEffect } from 'react';
import { SfSelect, SfInput, SfCheckbox, SfButton } from '@storefront-ui/react';
import { useFormik } from 'formik';
import { useFrappePostCall } from 'frappe-react-sdk';
import { addressSchema } from './addressFormSchema';

// Here you should provide a list of countries you want to support
// or use an up-to-date country list like: https://www.npmjs.com/package/country-list
const countries = ['Thailand', 'Pakistan', 'Germany', 'Great Britain', 'Poland', 'United States of America'];
const states = ['Sindh', 'Punjab', 'Balochistan', 'KPK', 'Florida', 'New York', 'Texas', 'Frankfurt', 'Berlin'];

const AddressForm = ({
    onSuccess = () => { },
}) => {

    const { call, isCompleted } = useFrappePostCall('headless_e_commerce.api.add_address')

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
        onSubmit: call
    });

    useEffect(() => {
        if (isCompleted) {
            onSuccess();
            formik.resetForm();
        }
    }, [isCompleted])

    return (
        <form className="max-w-[950px] flex gap-x-4 gap-y-6 flex-wrap text-neutral-900" onSubmit={formik.handleSubmit}>
            {/* <h2 className="w-full typography-headline-4 md:typography-headline-3 font-bold">Billing address</h2> */}
            <div className='w-full flex flex-col gap-4 md:flex-row md:justify-between'>
                <div className="w-full flex-grow flex flex-col gap-0.5">
                    <label>
                        <span className="text-sm font-medium mb-2 block">Name <span className='text-red-500'>*</span></span>
                        <SfInput
                            name="address_line1"
                            className="mt-0.5"
                            onChange={formik.handleChange}
                            value={formik.values.address_title}
                            invalid={formik.errors.address_title}
                        />
                    </label>
                    {formik.errors.address_line1 && (
                        <strong className="typography-error-sm text-negative-700 font-medium">Please provide a street name</strong>
                    )}
                </div>
                <div className="w-full flex flex-col gap-0.5">
                    <label>
                        <span className="text-sm font-medium mb-2 block">Phone <span className='text-red-500'>*</span></span>
                        <SfInput name="address_line2" className="mt-0.5" onChange={formik.handleChange} value={formik.values.phone} />
                    </label>
                </div>
            </div>
            <div className='w-full flex flex-col gap-4 md:flex-row md:justify-between'>
                <div className="w-full flex-grow flex flex-col gap-0.5">
                    <label>
                        <span className="text-sm font-medium mb-2 block">Address line 1 <span className='text-red-500'>*</span></span>
                        <SfInput
                            name="address_line1"
                            className="mt-0.5"
                            onChange={formik.handleChange}
                            value={formik.values.address_line1}
                            invalid={formik.errors.address_line1}
                        />
                    </label>
                    {formik.errors.address_line1 && (
                        <strong className="typography-error-sm text-negative-700 font-medium">Please provide a street name</strong>
                    )}
                    <small className="typography-text-xs text-neutral-500">Street address or P.O. Box</small>
                </div>
                <div className="w-full flex flex-col gap-0.5">
                    <label>
                        <span className="text-sm font-medium mb-2 block">Address line 2</span>
                        <SfInput name="address_line2" className="mt-0.5" onChange={formik.handleChange} value={formik.values.address_line2} />
                    </label>
                </div>
            </div>
            <div className="w-full flex flex-col gap-0.5 flex flex-col gap-0.5">
                <label>
                    <span className="text-sm font-medium mb-2 block">Country <span className='text-red-500'>*</span></span>
                    <SfSelect name="country" placeholder="-- Select --" onChange={formik.handleChange} value={formik.values.country} invalid={formik.errors.country}>
                        {countries.map((countryName) => (
                            <option key={countryName} value={countryName}>{countryName}</option>
                        ))}
                    </SfSelect>
                </label>
                {formik.errors.country && (
                    <strong className="typography-error-sm text-negative-700 font-medium">{formik.errors.country}</strong>
                )}
            </div>
            <label className="w-full md:w-auto flex flex-col gap-0.5 flex-grow">
                <span className="text-sm font-medium mb-2 block">State</span>
                <SfSelect name="state" placeholder="-- Select --" onChange={formik.handleChange} value={formik.values.state}>
                    {states.map((stateName) => (
                        <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                </SfSelect>
            </label>
            <div className='w-full flex flex-col gap-4 md:flex-row md:justify-between'>
                <div className="w-full flex flex-col gap-0.5">
                    <label>
                        <span className="text-sm font-medium mb-2 block">City <span className='text-red-500'>*</span></span>
                        <SfInput name="city" placeholder="eg. New York" onChange={formik.handleChange} value={formik.values.city} invalid={formik.errors.city} />
                    </label>
                    {formik.errors.city && (
                        <strong className="typography-error-sm text-negative-700 font-medium">{formik.errors.city}</strong>
                    )}
                </div>
                <div className="w-full flex flex-col gap-0.5">
                    <label>
                        <span className="text-sm font-medium mb-2 block">Postal code</span>
                        <SfInput name="pincode" placeholder="eg. 12345" onChange={formik.handleChange} value={formik.values.pincode} />
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

            <div className="w-full flex gap-4 mt-4 md:mt-0 md:justify-start">
                <SfButton type="reset" variant='tertiary' className="w-full md:w-auto btn-secondary text-sm" onClick={formik.handleReset}>
                    Clear all
                </SfButton>
                <SfButton type='submit' className="w-full md:w-auto btn-primary text-sm">Save</SfButton>
            </div>
        </form>
    )
}

export default AddressForm;