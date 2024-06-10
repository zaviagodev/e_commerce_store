import { t } from "i18next";
import * as yup from "yup";

export const confirmPaymentSchema = yup.object().shape({
  invoice_name: yup.string().required(t("Order id is required")),
  payment_info: yup.object().shape({
    payment_method_key: yup
      .string()
      .required(t("Payment method should be selected")),
    bank: yup.string().required(t("Bank is required")),
  }),
  file: yup
    .mixed()
    .required(t("Payment proof is required"))
    .test("fileFormat", "Payment proof is required", (value) => {
      if (value == "") {
        return false;
      }
      console.log("value", value);

      if (typeof value !== "string") {
        const supportedFormats = ["png", "jpg", "jpeg"];
        return supportedFormats.includes(value?.name.split(".").pop());
      }
      return true;
    }),
});
