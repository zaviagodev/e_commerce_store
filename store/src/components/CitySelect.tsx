import { CrudFilters, useSelect } from "@refinedev/core";
import React, { useMemo } from "react";
import Select from "react-select";

type CitySelectProps = {
  name: string;
  onChange: (value: any) => void;
  value: any;
  state?: string;
  country?: string;
};

const CitySelect: React.FC<CitySelectProps> = ({
  name,
  onChange,
  value,
  state,
  country,
  ...props
}) => {
  const filters = useMemo<CrudFilters>((): CrudFilters => {
    const filters: CrudFilters = [];
    if (state) {
      filters.push({
        field: "state",
        operator: "eq",
        value: state,
      });
    }
    if (country) {
      filters.push({
        field: "country",
        operator: "eq",
        value: country,
      });
    }
    return filters;
  }, [state, country]);

  const { options, onSearch, overtime } = useSelect({
    resource: "City",
    dataProviderName: "frappeProvider",
    optionLabel: "city_name",
    optionValue: "name",
    searchField: "city_name",
    filters: filters,
    meta: {
      fields: ["name", "city_name"],
    },
    overtimeOptions: {
      interval: 100,
    },
  });

  return (
    <Select
      placeholder="City"
      isLoading={overtime.elapsedTime !== undefined}
      loadingMessage={() =>
        options.length === 0 ? "No results" : "Loading..."
      }
      classNames={{
        control: () =>
          "!border-darkgray-100 !bg-accent !rounded-xl px-3.5 text-sm h-12.5 !shadow-none",
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

export default CitySelect;
