import { useMemo } from "react";

const useSummary = (orderDoc: any) => {
  const checkoutSummary = useMemo(() => {
    if (orderDoc && orderDoc.shipping_rule) {
      const totalShipping =
        orderDoc.taxes.find(
          ({ description }: any) => description === orderDoc.shipping_rule
        )?.tax_amount ?? 0;
      const totalTax = Math.max(
        orderDoc.total_taxes_and_charges - totalShipping,
        0
      );
      const total = orderDoc.total;
      return {
        totalTax,
        totalShipping,
        totalDiscount: !orderDoc.grand_total
          ? 0
          : total +
            totalTax +
            totalShipping -
            orderDoc.grand_total +
            orderDoc.discount_amount,
      };
    }
    return {
      totalTax: 0,
      totalShipping: 0,
      totalDiscount: 0,
    };
  }, [orderDoc]);

  return checkoutSummary;
};

export default useSummary;
