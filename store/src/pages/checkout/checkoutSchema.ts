import { t } from "i18next";
import * as yup from "yup";

export const checkoutSchema = yup.object().shape({
  paymentMethod: yup.string().required(t("Please select a payment method")),
  shippingRule: yup.string().required(t("Please select a shipping rule")),
  address: yup.string().required(t("Please select an address")),
});
