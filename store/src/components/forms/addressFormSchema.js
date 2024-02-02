import * as Yup from 'yup';

export const addressSchema = Yup.object().shape({
    address_title: Yup.string().required('จำเป็นต้องกรอกข้อมูล'),
    phone: Yup.string().required('จำเป็นต้องกรอกข้อมูล'),
    address_line1: Yup.string().required('จำเป็นต้องกรอกข้อมูล'),
    address_line2: Yup.string().required('จำเป็นต้องกรอกข้อมูล'),
    city: Yup.string().required('จำเป็นต้องกรอกข้อมูล'),
    country: Yup.string().required('จำเป็นต้องกรอกข้อมูล'),
    state: Yup.string().required('จำเป็นต้องกรอกข้อมูล'),
    pincode: Yup.number().positive().typeError('Pincode must be a number').required('จำเป็นต้องกรอกข้อมูล'),
    is_shipping_address: Yup.number().oneOf([0, 1]),
    is_primary_address: Yup.number().oneOf([0, 1]),
});
