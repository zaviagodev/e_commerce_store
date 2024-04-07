import { CrudFilter, GetListParams } from "@refinedev/core";

export interface TransformArgs {
  [key: string]: {
    list: (args: GetListParams) => Record<string, any>;
  };
}

export const transformArgs: TransformArgs = {
  products: {
    list: (args: GetListParams) => {
      const filters = args.filters?.reduce(
        (acc: Record<string, any>, filter: CrudFilter | undefined) => {
          if (filter && "field" in filter) {
            const [filterCat, filterField] = (filter.field as string).split(
              "."
            );
            if (filterCat === "field_filters") {
              acc.field_filters[filterField] = filter.value;
            } else if (filterCat === "attribute_filters") {
              acc.attribute_filters.push(filter);
            } else {
              acc[filterCat] = filter.value;
            }
          }
          return acc;
        },
        {
          search: undefined,
          field_filters: {},
          attribute_filters: [],
        } as Record<string, any>
      );

      return {
        ...filters,
      };
    },
  },
  orders: {
    list: (args: GetListParams) => {
      const filters = args.filters?.reduce(
        (acc: Record<string, any>, filter: CrudFilter | undefined) => {
          if (filter && "field" in filter) {
            const [filterCat, filterField] = (filter.field as string).split(
              "."
            );
            if (filterCat == "filters") {
              acc[filterCat] = JSON.stringify({ [filterField]: filter.value });
            } else {
              acc[filterCat] = filter.value;
            }
          }
          return acc;
        },
        {
          search: undefined,
        } as Record<string, any>
      );

      return {
        ...filters,
      };
    },
  },
};
