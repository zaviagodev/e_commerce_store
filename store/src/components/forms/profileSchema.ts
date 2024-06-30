import { t } from "i18next";
import * as yup from "yup";

export const profileSchema = yup.object().shape({
  email: yup.string().email().required(t("Email is required")),
  first_name: yup.string().required(t("Name is required")),
  last_name: yup.string(), // .required(t("Surame is required"))
});
