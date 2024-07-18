import { CrudFilters, useSelect, useTranslate } from "@refinedev/core";
import React, { useMemo } from "react";
import { Pencil } from "lucide-react";
import Select, { DropdownIndicatorProps, components } from "react-select";

type StateSelectProps = {
  name: string;
  onChange: (value: any) => void;
  value: any;
  country?: string;
};

const StateSelect: React.FC<StateSelectProps> = ({
  name,
  onChange,
  value,
  country,
  ...props
}) => {
  const filters = useMemo<CrudFilters>((): CrudFilters => {
    const filters: CrudFilters = [];
    if (country) {
      filters.push({
        field: "country",
        operator: "eq",
        value: country,
      });
    }
    return filters;
  }, [country]);

  const { options, onSearch, overtime } = useSelect({
    resource: "State",
    dataProviderName: "frappeProvider",
    optionLabel: "state_name",
    optionValue: "name",
    searchField: "state_name",
    filters: filters,
    meta: {
      fields: ["name", "state_name"],
    },
    overtimeOptions: {
      interval: 100,
    },
  });

  const t = useTranslate();

  const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
      <components.DropdownIndicator {...props}>
        <Pencil className="w-4 h-4"/>
      </components.DropdownIndicator>
    )
  }

  return (
    <Select
      placeholder={`${t("state")} *`}
      isLoading={overtime.elapsedTime !== undefined}
      loadingMessage={() =>
        options.length === 0 ? "No results" : "Loading..."
      }
      components={{ DropdownIndicator }}
      classNames={{
        control: () =>
          "!border-darkgray-100 !bg-accent !rounded-xl px-3.5 text-sm h-12.5 !shadow-none",
        placeholder: () => "!text-darkgray-300",
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

export default StateSelect;
