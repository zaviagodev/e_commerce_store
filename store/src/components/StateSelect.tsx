import { CrudFilters, useSelect } from "@refinedev/core";
import React, { useMemo } from "react";
import Select from "react-select";

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
    dataProviderName: "frappeeProvider",
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

  return (
    <Select
      classNamePrefix="select"
      placeholder="State"
      isLoading={overtime.elapsedTime !== undefined}
      loadingMessage={() =>
        options.length === 0 ? "No results" : "Loading..."
      }
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
