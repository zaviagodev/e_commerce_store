import React, { createContext, useContext, useState, useEffect } from 'react'
import {   useFrappeGetCall} from 'frappe-react-sdk';


const ProductsContext = createContext([])

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [newP, setNewP] = useState(null)
    const [mainGroup, setMainGroup] = useState([])
    const [settingPage, setsettingPage] = useState([])


    const {mutate : mutateItemsList, error : itemListError, isLoading} = useFrappeGetCall('webshop.webshop.api.get_product_filter_data', {
        name: newP,
        query_args: { "field_filters": {}, "attribute_filters": {}, "item_group": null, "start": null, "from_filters": false }
    }, `products-${newP}`, {
        isOnline: () => products.length === 0,
        onSuccess: (data) => {
            setProducts(data.message.items);
            setsettingPage(data.message.settings);
        }
        
    })



    const {mutate : mutateGeneralList, error:groupeError} = useFrappeGetCall('webshop.webshop.api.get_main_group',undefined,undefined,{
        isOnline: () => mainGroup.length === 0,
        onSuccess: (data) => setMainGroup(data.message)
    })

    const getWishedProducts = () => {
        return products.filter((product) => product.wished)
    }
    

    const get = (name) => {
        // if product is already in the list, return it & refetch it in the background
        const p = products.find((product) => product.name === name)
        // if product is not in the list, return null & fetch it in the background
        if (!p) {
            setNewP(name)
        }
        return p
    }

    const getItemByCategorie = (categorie) => {
        return products.filter((product) => product.item_group === categorie)
    }

    const getByItemCode = (itemCode) => {
        // if product is already in the list, return it & refetch it in the background
        const p = products.find((product) => product.item_code === itemCode)
        return p
    }

    const getProductsCodeInCart= () => {
        return products.filter((product) => product.in_cart == true).map((product) => product.item_code).flat()
    }


    const getProductGroups = () => {
        return mainGroup
    }





    return (
        <ProductsContext.Provider value={        
{            
            products,
            setProducts,
            get,
            getByItemCode,
            getProductGroups,
            mutateGeneralList,
            groupeError,
            mutateItemsList,
            itemListError,
            isLoading,
            getWishedProducts,
            mainGroup,
            settingPage,
            getItemByCategorie,
            getProductsCodeInCart
            }}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = () => useContext(ProductsContext)
