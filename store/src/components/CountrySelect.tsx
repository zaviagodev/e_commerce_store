import { useSelect, useTranslate } from "@refinedev/core";
import { Pencil } from "lucide-react";
import Select, { DropdownIndicatorProps, components } from "react-select";

type CountrySelectProps = {
  name: string;
  onChange: (value: any) => void;
  value: any;
};

const CountrySelect: React.FC<CountrySelectProps> = ({
  name,
  onChange,
  value,
  ...props
}) => {
  const { options, onSearch, overtime } = useSelect({
    resource: "Country",
    dataProviderName: "frappeProvider",
    optionLabel: "name",
    optionValue: "name",
    searchField: "name",
    overtimeOptions: {
      interval: 100,
    },
  });

  const t = useTranslate()

  const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
      <components.DropdownIndicator {...props}>
        <Pencil className="w-4 h-4"/>
      </components.DropdownIndicator>
    )
  }

  return (
    <Select
      placeholder={`${t("country")} *`} 
      isLoading={overtime.elapsedTime !== undefined}
      loadingMessage={() =>
        options.length === 0 ? "No results" : "Loading..."
      }
      components={{ DropdownIndicator }}
      classNames={{
        control: () => "!border-darkgray-100 !bg-accent !rounded-xl px-3.5 text-sm h-12.5 !shadow-none",
        placeholder: () => "!text-darkgray-300"
      }}
      styles={{
        indicatorSeparator: () => ({ display: "none" }),
      }}
      value={
        value === undefined
          ? ""
          : options.find((option) => option.value === value) ?? {
              value: value,
              label: value,
            }
      }
      options={options}
      onInputChange={onSearch}
      onChange={onChange}
      name={name}
      {...props}
    />
  );
};

export default CountrySelect;
