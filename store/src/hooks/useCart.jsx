import React, { useEffect, createContext, useContext, useState } from 'react'
import { useProducts } from './useProducts'

const CartContext = createContext([])

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({})
    const [isOpen, _] = useState(false)


    const cartCount = Object.keys(cart).reduce((total, itemCode) => {
        return total + cart[itemCode]
    }, 0)
    const { getByItemCode } = useProducts()

    useEffect(() => {
        // get cart state from local storage
        const cart = localStorage.getItem('cart')
        if (cart) {
            setCart(JSON.parse(cart))
            console.log(cart)
        }
    }, [])

    const setIsOpen = (value) => {
        if (value !== undefined || value !== null) {
            return _(value)
        }
        return _(!isOpen)
    }


    const addToCart = async (itemCode, quantity) => {
        setCart({ ...cart, [itemCode]: quantity ?? (cart[itemCode] ?? 0) + 1 })
        console.log(quantity)
        // store cart state in local storage
        localStorage.setItem('cart', JSON.stringify({ ...cart, [itemCode]: quantity ?? (cart[itemCode] ?? 0) + 1 }))
    }

    const removeFromCart = (itemCode) => {
        const newCart = { ...cart }
        delete newCart[itemCode]
        setCart(newCart)
        // store cart state in local storage
        localStorage.setItem('cart', JSON.stringify(newCart))
    }

    const resetCart = () => {
        setCart({})
        // store cart state in local storage
        localStorage.setItem('cart', JSON.stringify({}))
    }


    const getTotal = () => {
        return Object.keys(cart).reduce((total, itemCode) => {
            const product = getByItemCode(itemCode)
            if (product) {
                return total + product.price_list_rate * cart[itemCode]
            }
        }, 0)
    }


    return (
        <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, resetCart, getTotal, isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
