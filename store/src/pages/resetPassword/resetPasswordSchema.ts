import { t } from "i18next";
import * as yup from "yup";

export const resetPasswordSchema = yup.object().shape({
  key: yup.string(),
  password: yup.string().required(t("Password is required")),
});
