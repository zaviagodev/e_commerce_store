import { useGetLocale, useSetLocale, useTranslate } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const LangSelect = (props: any) => {
  const { i18n } = useTranslation();
  const t = useTranslate();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();

  const currentLocale = locale();

  const menuItems = Object.keys(i18n.options.resources ?? {}).map((key) => ({
    key,
    /*
    t(`language.en`)
    t(`language.th`)
    */
    label: t(`language.${key}`),
  }));

  return (
    <Select value={currentLocale} onValueChange={changeLanguage}>
      <SelectTrigger {...props}>
        <Globe className="w-4 h-4 stroke-[1.5]"/>
        <SelectValue className="w-full" />
      </SelectTrigger>
      <SelectContent>
        {menuItems.map((item) => (
          <SelectItem key={item.key} value={item.key}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LangSelect;
