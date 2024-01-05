import React, { useEffect, createContext, useContext, useState } from 'react'
import { useProducts } from './useProducts'
import { useFrappePutCall } from 'frappe-react-sdk'

const CartContext = createContext([])

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({})
    const [isOpen, _] = useState(false)
    const {mutateItemsList, getProductsCodeInCart, products} = useProducts()
    const {call , result, loading} = useFrappePutCall('webshop.webshop.shopping_cart.cart.update_cart')


    const cartCount = Object.keys(cart).reduce((total, itemCode) => {
        return total + cart[itemCode]
    }, 0)

    const { getByItemCode } = useProducts()

    useEffect(() => {
        // get cart state from local storage
        if(products.length == 0) return
        const cartStorage = localStorage.getItem('cart')
        if(Object.keys(cart).length === 0 && !result && !loading )
        {
            const cartObject = JSON.parse(cartStorage);
            if(typeof cartObject != 'undefined')  {
                setCart(cartObject)
                if(!verifyCart(cartObject))
                {
                    resetBackEndCart
                    updateCart(cartObject)
                }
            }
        }
    }, [products])

    function resetBackEndCart() {
        products.forEach(async (product) => {
            try {
                await call({"item_code" : product.item_code, 'qty' : 0})
            } catch (error) {
                console.log(error)
            }
        }
        )
        mutateItemsList()
    }

    function verifyCart(cartObject) {
        const productCodes = getProductsCodeInCart();

        const allItemsExist = Object.keys(cartObject).every(itemCode => productCodes.includes(itemCode));
    
        return allItemsExist;
    }

    async function updateCart(cartObject) {
        for (const [itemCode, value] of Object.entries(cartObject)) {
            try {
                await call({"item_code" : itemCode, 'qty' : value})
            } catch (error) {
                console.log(error)
            }
        }
        mutateItemsList()
    }


    const setIsOpen = (value) => {
        if (value !== undefined || value !== null) {
            return _(value)
        }
        return _(!isOpen)
    }


    const addToCart = async (itemCode, quantity) => {
        setCart({ ...cart, [itemCode]: quantity ?? (cart[itemCode] ?? 0) + 1 })
        try {
        call({"item_code" : itemCode, 'qty' : quantity ?? (cart[itemCode] ?? 0) + 1}).then(() => {

        mutateItemsList()
        })
        } catch (error) {
            console.log(error)
        }
        // store cart state in local storage
        localStorage.setItem('cart', JSON.stringify({ ...cart, [itemCode]: quantity ?? (cart[itemCode] ?? 0) + 1 }))
    }

    const removeFromCart = (itemCode) => {
        const newCart = { ...cart }
        delete newCart[itemCode]
        setCart(newCart)
        try
        {
        call({"item_code" : itemCode, 'qty' : 0}).then(() => {
            
            mutateItemsList()
        })
        }
        catch(error)
        {
            console.log(error)
        }
        // store cart state in local storage
        localStorage.setItem('cart', JSON.stringify(newCart))
    }

    const resetCart = () => {
        setCart({})
        // store cart state in local storage
        localStorage.setItem('cart', JSON.stringify({}))
        window.location.reload()
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
        <CartContext.Provider value={{loading, cart, cartCount, addToCart, removeFromCart, resetCart, getTotal, isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
