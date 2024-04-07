// @ts-nocheck
import { GetListResponse } from "@refinedev/core";

export interface TransformRes {
  [key: string]: {
    list: (res: any) => GetListResponse<TData>;
  };
}

export const transformRes: TransformRes = {
  products: {
    list: (res) => {
      return {
        data: res?.message.items,
        total: res?.message.items_count,
      };
    },
  },
  address: {
    list: (res) => {
      return {
        data: res?.message,
        total: res?.message.length,
      };
    },
  },
  orders: {
    list: (res) => {
      return {
        data: res?.message.orders,
        total: res?.message?.count ?? 0,
      };
    },
  },
};
