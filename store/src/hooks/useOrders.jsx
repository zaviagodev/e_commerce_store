

import React, {createContext, useContext, useState } from 'react'
import { useFrappeGetCall } from 'frappe-react-sdk';

const OrderContext = createContext([])

export const OrderProvider = ({ children }) => {
    const [Order, setOrder] = useState([])

    const {mutate : mutateOrder, error:orderError, isLoading:orderLoading} = useFrappeGetCall('webshop.webshop.api.get_orders',undefined,undefined,{
        isOnline: () => Order.length === 0,
        onSuccess: (data) => {
            setOrder(data.message)
        }
    })

    const getOrderByOrderCode = (orderCode) => {
        const o = Order.find((order) => order.name === orderCode)
        return o
    }
    

    const ContextValue ={
        Order,
        setOrder,
        mutateOrder,
        orderError,
        getOrderByOrderCode,
        orderLoading
    }

    return (
        <OrderContext.Provider value={ContextValue}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => useContext(OrderContext)
