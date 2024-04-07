import React, { createContext, useContext, useMemo, useState } from "react";
import _debounce from "lodash/debounce";
import { useCustom, useOne } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";

interface Checkout {
  current: number;
  setCurrent: (value: number) => void;
  next: () => void;
  prev: () => void;
  setTotalSteps: (value: number) => void;
  paymentMethods: any;
  selectedPaymentMethod: any;
  orderId: any;
  order: any;
  setOrderId: (value: string) => void;
}

export const CheckoutContext = createContext<Checkout>({
  current: 0,
  setCurrent: () => {},
  next: () => {},
  prev: () => {},
  setTotalSteps: () => {},
  paymentMethods: [],
  selectedPaymentMethod: null,
  orderId: null,
  order: null,
  setOrderId: () => {},
});

export const CheckoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [current, setCurrent] = useState(0);
  const [searchParams, _] = useSearchParams();

  const { data: paymentMethods } = useCustom({
    dataProviderName: "storeProvider",
    url: "payment_methods",
    method: "get",
  });

  const { data: order } = useOne({
    resource: "orders",
    id: searchParams.get("orderId") ?? undefined,
    queryOptions: {
      enabled: !!searchParams.get("orderId"),
    },
  });

  const selectedPaymentMethod = useMemo(() => {
    return paymentMethods?.message.find(
      (method: any) => method.name === searchParams.get("paymentMethod")
    );
  }, [paymentMethods, searchParams.get("paymentMethod")]);

  const setOrderId = (orderId: string) => {
    searchParams.set("orderId", orderId);
  };

  var totalSteps: number = 0;
  const setTotalSteps = (steps: number) => {
    totalSteps = steps;
  };

  const next = () => {
    if (current < totalSteps) {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        current,
        setCurrent,
        next,
        prev,
        setTotalSteps,
        paymentMethods,
        selectedPaymentMethod,
        orderId: searchParams.get("orderId"),
        order: order?.message,
        setOrderId,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
