import React, { createContext, useContext, useState } from 'react'
import { useFrappeGetCall } from 'frappe-react-sdk';

const ProductsContext = createContext([])

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [newP, setNewP] = useState(null)

    useFrappeGetCall('webshop.webshop.api.get_product_filter_data', {
        name: newP,
        query_args: { "field_filters": {}, "attribute_filters": {}, "item_group": null, "start": null, "from_filters": false }
    }, `products-${newP}`, {
        isOnline: () => products.length === 0,
        onSuccess: (data) => setProducts(data.message.items)
    })


    const get = (name) => {
        // if product is already in the list, return it & refetch it in the background
        const p = products.find((product) => product.name === name)
        // if product is not in the list, return null & fetch it in the background
        if (!p) {
            setNewP(name)
        }
        return p
    }

    const getByItemCode = (itemCode) => {
        // if product is already in the list, return it & refetch it in the background
        const p = products.find((product) => product.item_code === itemCode)
        return p
    }


    return (
        <ProductsContext.Provider value={{ products, setProducts, get, getByItemCode }}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = () => useContext(ProductsContext)
