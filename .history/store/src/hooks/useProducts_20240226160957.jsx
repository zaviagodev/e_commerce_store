import { createContext, useContext, useState, useEffect } from 'react'
import {   useFrappeGetCall} from 'frappe-react-sdk';
import PropTypes from 'prop-types';

const ProductsContext = createContext([])



export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [mainGroup, setMainGroup] = useState([])
    const [settingPage, setSettingPage] = useState([])
    const [totalItems, setTotalItems] = useState(0)
    const [pageNo, setPageNo] = useState(1)
    const [productInfo] = useState([])
    const [pageData, setPageData] = useState({});
    const [allItemsLoading, setAllItemsLoading] = useState(true);

    const {mutate : mutateItemsList, error : itemListError, isLoading} = useFrappeGetCall('webshop.webshop.api.get_product_filter_data', {
        query_args: { "field_filters": {}, "attribute_filters": {}, "item_group": null, "start": Math.max(0, (pageNo - 1) * 8), "from_filters": false }
    }, `products-${pageNo}`, {
        isOnline: () => products.length === 0,
        onSuccess: (data) => {

            setPageData((prevPageData) => ({
                ...prevPageData,
                [pageNo]: data.message.items
            }));

            setProducts(data.message.items);

            setSettingPage(data.message.settings);
            setTotalItems(data.message.total_items);
        }
        
    })

    const [start, setStart] = useState(0);
    const {  mutate : mutateAllItemsList, error : itemAllListError, isLoading : itemAllIsLoading} = useFrappeGetCall('webshop.webshop.api.get_product_filter_data', {
        query_args: { "field_filters": {}, "attribute_filters": {},"start":start*8 , "item_group": null, "from_filters": false }
    }, `products-all`, {    
        isOnline: () => products.length === 0,
        onSuccess: (data) => {
            setAllProducts((prev) => [...prev , ...data.message.items]);
            if(start <= Math.floor(data.message.items_count / 8)+1)
            {

                setStart((prev) => prev + 1);
            } else {
                setAllItemsLoading(false);
            } 
        }      
    })

    useEffect(() => {
        if (itemAllIsLoading) { setAllItemsLoading(itemAllIsLoading) }
    },[itemAllIsLoading, setAllItemsLoading])

    useEffect(() => {
        mutateAllItemsList();
      }, [mutateAllItemsList, start]); // Re-fetch the data whenever start changes



    const {mutate : mutateGeneralList, error:groupeError} = useFrappeGetCall('webshop.webshop.api.get_main_group',undefined,undefined,{
        isOnline: () => mainGroup.length === 0,
        onSuccess: (data) => setMainGroup(data.message)
    })

    const getWishedProducts = () => {
        return products.filter((product) => product.wished)
    }
    

    const get =  (name) => {
        
        // const p = products.find((product) => product.name === name);
        // if (!p) {
        //     setNewP(name);
            
        // }
        // return p;
        const swrResult =  useFrappeGetCall('webshop.webshop.api.get_product_filter_data', {
            query_args: { "field_filters": {"name": name}, "attribute_filters": {}, "item_group": null, "start": 0, "from_filters": false }
        }, `products-${name}`, {
            isOnline: () => true,
        });
        return swrResult.data?.message?.items[0];
    };


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
        console.log(allProducts)
        // If pageData is null or the product is not found in any page, search within products
        const productInProducts = allProducts.find((product) => product.item_code === itemCode);
    
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
            totalItems,
            productInfo,
            pageNo,
            setPageNo,
            getGroupedProducts,
            getProductsCodeInCart,
            allProducts,
            mutateAllItemsList,
            itemAllListError,
            allItemsLoading
            }}>
            {children}
        </ProductsContext.Provider>
    )
}


ProductsProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export const useProducts = () => useContext(ProductsContext)