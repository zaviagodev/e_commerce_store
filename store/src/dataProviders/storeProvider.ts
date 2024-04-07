import {
  BaseRecord,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  LogicalFilter,
  UpdateParams,
  UpdateResponse,
} from "@refinedev/core";
import apis, { auth, cart, checkout, misc } from "../client/api";
import { transformArgs } from "./transformArgs";
import { transformRes } from "./transformRes";

export const storeProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    // pagenation
    const start =
      ((pagination?.current ?? 0) - 1) * (pagination?.pageSize ?? 20);

    // transform args
    const args = transformArgs[resource as keyof typeof transformArgs]?.list({
      resource,
      filters: filters as LogicalFilter[],
      pagination,
      sorters,
    });

    // call api
    const res = await apis[resource as keyof typeof apis]?.list({
      start,
      page_size: pagination?.pageSize,
      ...args,
    });

    // return data
    return transformRes[resource as keyof typeof transformRes]?.list(res);
  },
  getMany: async ({ resource, ids, dataProviderName, meta }) => {
    return await apis[resource as keyof typeof apis]?.list?.(ids as string[]);
  },
  getOne: async ({ resource, id, meta }) => {
    return await apis[resource as keyof typeof apis]?.get?.(id as string);
  },
  create: async ({ resource, variables, meta }) => {
    return await apis[resource as keyof typeof apis]?.create?.(variables);
  },
  update: async ({ resource, id, variables, meta }) => {
    return await apis[resource as keyof typeof apis]?.update?.(
      id as string,
      variables
    );
  },
  deleteOne: async ({ resource, id, meta }) => {
    return await apis[resource as keyof typeof apis]?.delete?.(id as string);
  },
  getApiUrl: () => `${import.meta.env.VITE_BACKEND_URL ?? ""}/api`,
  custom: async ({ url, payload }) => {
    const customMap = {
      update_profile: auth.updateProfile,
      apply_shipping_rule: cart.applyShippingRule,
      apply_coupon_code: cart.applyCouponCode,
      update_cart_address: cart.updateCartAddress,
      payment_methods: checkout.getPaymentMethods,
      confirm_payment: checkout.confirmPayment,
      get_config: misc.getConfig,
    };
    return await customMap[url as keyof typeof customMap]?.(payload);
  },
};
