import api from "./api-client";

export const auth = {
  login: async ({ usr, pwd }: { usr: string; pwd: string }): Promise<any> =>
    api.post("/method/login", { usr, pwd }).then((res) => res.data),
  whoami: async (): Promise<any> =>
    api.get("/method/e_commerce_store.api.get_profile").then((res) => res.data),
  updateProfile: async (data: any): Promise<any> =>
    api
      .post("/method/webshop.webshop.api.update_profile", data)
      .then((res) => res.data),
  logout: async (): Promise<any> =>
    api.get("/method/logout").then((res) => res.data),
  register: async (data: any): Promise<any> =>
    api
      .post("/method/webshop.webshop.api.sign_up", data)
      .then((res) => res.data),
  forgotPassword: async (data: any): Promise<any> =>
    api
      .post("/method/frappe.core.doctype.user.user.reset_password", {
        user: data.email,
      })
      .then((res) => res.data),
  updatePassword: async (data: any): Promise<any> =>
    api
      .post("/method/frappe.core.doctype.user.user.update_password", {
        old_password: data.old_password,
        new_password: data.password,
        key: data.key,
      })
      .then((res) => res.data),
};

export const products = {
  list: (params: any) =>
    api
      .get("method/webshop.webshop.api.get_product_filter_data", {
        params: { query_args: JSON.stringify(params) },
      })
      .then((res) => res.data),
  get: (itemCode: string) =>
    api
      .get(
        "method/webshop.webshop.shopping_cart.product_info.get_product_info_for_website",
        { params: { item_code: itemCode } }
      )
      .then((res) => res.data),
  findVariant: (params: any) =>
    api
      .post(
        "method/webshop.webshop.variant_selector.utils.get_next_attribute_and_values",
        params
      )
      .then((res) => res.data),
  create: null,
  update: null,
  delete: null,
};

export const categories = {
  list: (params: any) =>
    api
      .get(
        "method/webshop.templates.pages.product_search.get_category_suggestions",
        {
          params: { query: "", ...params },
        }
      )
      .then((res) => res.data),
  get: null,
  create: null,
  update: null,
  delete: null,
};

export const address = {
  list: (params: any) =>
    api
      .get("method/webshop.webshop.shopping_cart.cart.get_addresses", {
        params: params,
      })
      .then((res) => res.data),
  create: (data: any) =>
    api
      .post("method/webshop.webshop.shopping_cart.cart.add_new_address", {
        doc: data,
      })
      .then((res) => res.data),
  update: (addressName: string, data: any) =>
    api
      .put("method/webshop.webshop.shopping_cart.cart.update_address", {
        address_name: addressName,
        address: data,
      })
      .then((res) => res.data),
  get: (addressName: string) =>
    api
      .get("method/webshop.webshop.shopping_cart.cart.get_address", {
        params: { address_name: addressName },
      })
      .then((res) => res.data),
  delete: (addressName: string) =>
    api
      .delete("method/webshop.webshop.shopping_cart.cart.delete_address", {
        params: { address_name: addressName },
      })
      .then((res) => res.data),
};

export const cart = {
  get: (params?: any) =>
    api
      .get("method/webshop.webshop.shopping_cart.cart.get_cart_quotation", {
        params: params,
      })
      .then((res) => res.data),
  update: (cart: Record<string, number | undefined>) =>
    api
      .post("method/webshop.webshop.api.update_cart", { cart })
      .then((res) => res.data),
  applyShippingRule: (data: any) =>
    api
      .post(
        "method/webshop.webshop.shopping_cart.cart.apply_shipping_rule",
        data
      )
      .then((res) => res.data),
  applyCouponCode: (data: any) =>
    api
      .post("method/webshop.webshop.shopping_cart.cart.apply_coupon_code", data)
      .then((res) => res.data),
  updateCartAddress: (data: any) =>
    api
      .post(
        "method/webshop.webshop.shopping_cart.cart.update_cart_address",
        data
      )
      .then((res) => res.data),
  list: null,
  create: null,
  delete: null,
};

export const orders = {
  list: (params: any) =>
    api
      .get("method/webshop.webshop.api.get_orders", {
        params: params,
      })
      .then((res) => res.data),
  get: (orderName: string) =>
    api
      .get("method/webshop.webshop.api.get_order", {
        params: { invoice_name: orderName },
      })
      .then((res) => res.data),
  create: (data: any) =>
    api
      .post("method/webshop.webshop.shopping_cart.cart.place_order", data)
      .then((res) => res.data),
  update: null,
  delete: null,
};

export const checkout = {
  getPaymentMethods: () =>
    api
      .get("method/webshop.webshop.api.payment_methods")
      .then((res) => res.data),
  confirmPayment: (data: any) =>
    api
      .post("method/webshop.webshop.api.confirm_payment", data)
      .then((res) => res.data),
};

export const wishlist = {
  list: (
    username: string,
    params: any = {
      fields: ["items"],
    }
  ) =>
    api
      .get(`resource/Wishlist/${username}`, {
        params: params,
      })
      .then((res) => res.data),
  update: (itemCodes: string[]) =>
    api
      .put("method/webshop.webshop.api.update_wshlist", {
        item_codes: itemCodes,
      })
      .then((res) => res.data),
  create: null,
  get: null,
  delete: null,
};

export const misc = {
  getConfig: () =>
    api.get("method/webshop.webshop.api.get_config").then((res) => res.data),
};

export default {
  products,
  address,
  categories,
  orders,
};
