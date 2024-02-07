import React, { createContext, useContext, useState, useEffect } from 'react'
import {   useFrappeGetCall} from 'frappe-react-sdk';


const ProductsContext = createContext([])

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [newP, setNewP] = useState(null)
    const [mainGroup, setMainGroup] = useState([])
    const [settingPage, setsettingPage] = useState([])
    const [totalitems, settotalitems] = useState(0)
    const [pageno, setpageno] = useState(1)
    const [realtedproducts, setrealtedProducts] = useState(1)
    const [productinfo, setproductinfo] = useState([])
    const [pageData, setPageData] = useState({});

    const {mutate : mutateItemsList, error : itemListError, isLoading} = useFrappeGetCall('webshop.webshop.api.get_product_filter_data', {
        query_args: { "field_filters": {}, "attribute_filters": {}, "item_group": null, "start": Math.max(0, (pageno - 1) * 8), "from_filters": false }
    }, `products-${pageno}`, {
        isOnline: () => products.length === 0,
        onSuccess: (data) => {

            setPageData((prevPageData) => ({
                ...prevPageData,
                [pageno]: data.message.items
            }));

            setProducts(data.message.items);

            setsettingPage(data.message.settings);
            settotalitems(data.message.total_items);
        }
        
    })



    const {mutate : mutateGeneralList, error:groupeError} = useFrappeGetCall('webshop.webshop.api.get_main_group',undefined,undefined,{
        isOnline: () => mainGroup.length === 0,
        onSuccess: (data) => setMainGroup(data.message)
    })

    const getWishedProducts = () => {
        return products.filter((product) => product.wished)
    }
    

    const get =  (name) => {
        const p = products.find((product) => product.name === name);
        if (!p) {
            setNewP(name);
            
        }
        return p;
    };
    

    const getItemByCategorie = (categorie) => {
        return products.filter((product) => product.item_group === categorie)
    }


    const getGroupedProducts = (groupname) => {
        const swrResult = useFrappeGetCall('webshop.webshop.api.get_product_filter_data', {
            query_args: { "field_filters": {}, "attribute_filters": {}, "item_group": groupname, "start": 0, "from_filters": false }
        }, `products-${groupname}`, {
            isOnline: () => products.length === 0, 
        })

        return swrResult
        
    };

    const getByItemCode = (itemCode) => {
        // If pageData is not null, search within pageData
        if (pageData !== null) {
            // Iterate over each page in pageData
            for (const pageKey in pageData) {
                const pageArray = pageData[pageKey];
    
                // Use find to search for the product with the specified item_code in the current page
                const productInPage = pageArray.find((product) => product.item_code === itemCode);
    
                // If the product is found in the current page, return it
                if (productInPage) {
                    return productInPage;
                }
            }
        }
    
        // If pageData is null or the product is not found in any page, search within products
        const productInProducts = products.find((product) => product.item_code === itemCode);
    
        // Return the product found in products or null if not found
        return productInProducts || null;
    };
    
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
            pageData,
            totalitems,
            productinfo,
            pageno,
            setpageno,
            getGroupedProducts,
            getProductsCodeInCart
            }}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = () => useContext(ProductsContext)