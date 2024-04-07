import { t } from "i18next";
import * as yup from "yup";

export const addressSchema = yup.object().shape({
  address_title: yup.string().required(t("Title is required")),
  address_line1: yup.string().required(t("Address is required")),
  address_line2: yup.string(),
  city: yup.string().required(t("City is required")),
  state: yup.string(),
  country: yup.string().required(t("Country is required")),
  pincode: yup.string(),
  phone: yup.string().required(t("Phone is required")),
  is_primary_address: yup.number().oneOf([0, 1], t("Invalid value")),
  is_shipping_address: yup.number().oneOf([0, 1], t("Invalid value")),
  address_type: yup
    .string()
    .oneOf(
      ["Billing", "Shipping"],
      t("Address type must be either Billing or Shipping")
    ),
});
