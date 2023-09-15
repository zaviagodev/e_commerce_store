import * as Yup from 'yup';

export const orderSchema = Yup.object().shape({
    billing_address: Yup.string().test('billing-address', 'Billing address is required', function (value) {
        if (this.parent.cartContents.hasNormalItem) {
            return !!value;
        }
        return true;
    }),
    use_different_shipping: Yup.boolean().nullable(),
    shipping_address: Yup.string().test('shipping-address', 'Shipping address is required', function (value) {
        return this.parent.use_different_shipping ? !!value : true;
    }),
    loyalty_points: Yup.number().positive().typeError('Loyalty points must be a number').nullable(),
    items: Yup.array().of(
        Yup.object().shape({
            item_code: Yup.string().required('Item code is required'),
            qty: Yup.number().positive().typeError('Quantity must be a number').required('Quantity is required'),
        })
    ).min(1, 'At least one item is required'),
    payment_method: Yup.string().test('payment-method', 'Payment method is required', function (value) {
        if (this.parent.cartContents.hasNormalItem) {
            return !!value;
        }
        return true;
    }),
    branch: Yup.string().test('branch', 'Branch is required', function (value) {
        if (this.parent.cartContents.hasGiftItem) {
            return !!value;
        }
        return true;
    }),
});
