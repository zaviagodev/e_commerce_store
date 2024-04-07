import { t } from "i18next";
import * as yup from "yup";

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email(t("Invalid email"))
    .required(t("Email is required")),
});
