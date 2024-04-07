import { t } from "i18next";
import * as yup from "yup";

export const registerSchema = yup.object().shape({
  full_name: yup.string().required(t("Full name is required")),
  email: yup
    .string()
    .email(t("Invalid email"))
    .required(t("Email is required")),
  password: yup.string().required(t("Password is required")),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], t("Passwords must match")),
});
