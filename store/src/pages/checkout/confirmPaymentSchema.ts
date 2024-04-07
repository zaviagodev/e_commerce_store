import { t } from "i18next";
import * as yup from "yup";

export const confirmPaymentSchema = yup.object().shape({
  order_name: yup.string().required(t("Order id is required")),
  payment_info: yup.object().shape({
    payment_method_key: yup
      .string()
      .required(t("Payment method should be selected")),
    bank: yup.string().required(t("Bank is required")),
  }),
  file: yup.mixed().required(t("Payment proof is required")),
});
