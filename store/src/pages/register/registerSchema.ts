import { t } from "i18next";
import * as yup from "yup";

export const registerSchema = yup.object().shape({
  full_name: yup.string(),
  // .required(t("This field is required")), // Full name is required
  email: yup
    .string()
    .email(t("Invalid email"))
    .required(t("This field is required")), // Email is required
  // birth_date: yup.date().required(t("This field is required")),
  password: yup.string().required(t("This field is required")), // Password is required
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], t("Passwords must match")),
});
