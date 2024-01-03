import React, { useEffect, createContext, useContext, useState } from 'react'
import { useProducts } from './useProducts'
import { useFrappePostCall } from 'frappe-react-sdk'

const WishContext = createContext([])

export const WishProvider = ({ children }) => {
    const [Wish, setWish] = useState({})
    const [isOpen, _] = useState(false)

    const WishCount = Object.keys(Wish).reduce((total, itemCode) => {
        return total + Wish[itemCode]
    }, 0)

    const { getWishedProducts, mutateItemsList } = useProducts()

    const {call : addToWishList, loading : addLoading} = useFrappePostCall('webshop.webshop.doctype.wishlist.wishlist.add_to_wishlist')
    const {call : removeFromWishList, loading : removeLoading} = useFrappePostCall('webshop.webshop.doctype.wishlist.wishlist.remove_from_wishlist')

    useEffect(() => {
        // get Wish state from local storage
        const wish = localStorage.getItem('Wish')
        if (Object.keys(Wish).length === 0 && !addLoading && !removeLoading ) {
            const parsedWish = JSON.parse(wish)
            setWish(parsedWish)
            for (const [itemCode] of Object.entries(parsedWish)) {
                        addToWishList({'item_code': itemCode})
            }
            mutateItemsList()
        }
    }, [])

    const setIsOpen = (value) => {
        if (value !== undefined || value !== null) {
            return _(value)
        }
        return _(!isOpen)
    }



    const addToWish = async (itemCode) => {
        setWish({ ...Wish, [itemCode]:  1 })
        // store Wish state in local storage
        addToWishList({'item_code': itemCode}).then(() => {
            mutateItemsList()
        })
        localStorage.setItem('Wish', JSON.stringify({ ...Wish, [itemCode]:  1 }))
    }

    const removeFromWish = (itemCode) => {
        const newWish = { ...Wish }
        delete newWish[itemCode]
        setWish(newWish)
        removeFromWishList({'item_code': itemCode}).then(() => {
            mutateItemsList()
        })
        // store Wish state in local storage
        localStorage.setItem('Wish', JSON.stringify(newWish))
    }

    const resetWish = () => {
        setWish({})
        const products = getWishedProducts()
        products.map((product) => {
            if (product.wished) {
                removeFromWishList({'item_code': product.item_code})
            }
        })
        mutateItemsList()
        // store Wish state in local storage
        localStorage.setItem('Wish', JSON.stringify({}))
    }




    return (
        <WishContext.Provider value={{ 
            Wish, 
            WishCount, 
            addToWish, 
            removeFromWish, 
            resetWish, 
            isOpen, 
            setIsOpen 
            }}>
            {children}
        </WishContext.Provider>
    )
}

export const useWish = () => useContext(WishContext)
