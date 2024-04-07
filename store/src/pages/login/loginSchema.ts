import { t } from "i18next";
import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required(t("username or Email is required")),
  password: yup.string().required(t("Password is required")),
});
