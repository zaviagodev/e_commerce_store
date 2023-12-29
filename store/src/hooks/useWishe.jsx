import React, { useEffect, createContext, useContext, useState } from 'react'
import { useProducts } from './useProducts'

const WishContext = createContext([])

export const WishProvider = ({ children }) => {
    const [Wish, setWish] = useState({})
    const [isOpen, _] = useState(false)

    const WishCount = Object.keys(Wish).reduce((total, itemCode) => {
        return total + Wish[itemCode]
    }, 0)
    const { editProduct, getWishedProducts } = useProducts()



    useEffect(() => {
        // get Wish state from local storage
        const Wish = localStorage.getItem('Wish')
        if (Wish) {
            setWish(JSON.parse(Wish))
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
        editProduct(itemCode, true)
        localStorage.setItem('Wish', JSON.stringify({ ...Wish, [itemCode]:  1 }))
    }

    const removeFromWish = (itemCode) => {
        const newWish = { ...Wish }
        delete newWish[itemCode]
        setWish(newWish)
        editProduct(itemCode, false)
        // store Wish state in local storage
        localStorage.setItem('Wish', JSON.stringify(newWish))
    }

    const resetWish = () => {
        setWish({})
        products = getWishedProducts()
        products.map((product) => {
            editProduct(product.name, false)
        })
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
