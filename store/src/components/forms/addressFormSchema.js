import * as Yup from 'yup';

export const addressSchema = Yup.object().shape({
    address_line1: Yup.string().required('Address line 1 is required'),
    address_line2: Yup.string().nullable(),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().nullable(),
    pincode: Yup.number().positive().typeError('Pincode must be a number'),
    is_shipping_address: Yup.number().oneOf([0, 1]),
    is_primary_address: Yup.number().oneOf([0, 1]),
});
