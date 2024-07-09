import { t } from "i18next";
import * as yup from "yup";

export const addressSchema = yup.object().shape({
  address_title: yup.string().required(t("This field is required")), // Title is required
  address_line1: yup.string().required(t("This field is required")), // Address is required
  address_line2: yup.string().nullable(),
  city: yup.string().required(t("This field is required")), // City is required
  state: yup.string(),
  country: yup.string().required(t("This field is required")), // Country is required
  pincode: yup.string(),
  phone: yup.string().required(t("This field is required")), // Phone is required
  is_primary_address: yup.number().oneOf([0, 1], t("Invalid value")),
  is_shipping_address: yup.number().oneOf([0, 1], t("Invalid value")),
  address_type: yup
    .string()
    .oneOf(
      ["Billing", "Shipping"],
      t("Address type must be either Billing or Shipping")
    ),
});
