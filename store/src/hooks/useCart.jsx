import React, { useEffect, createContext, useContext, useState } from 'react'
import { useProducts } from './useProducts'
import { useFrappePutCall } from 'frappe-react-sdk'
import { debounce } from 'lodash';

const CartContext = createContext([])

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({})
    const [isOpen, _] = useState(false)
    const {mutateItemsList, getProductsCodeInCart, products} = useProducts()
    const {call , result, loading, error} = useFrappePutCall('webshop.webshop.shopping_cart.cart.update_cart')

    

    const fectchToAddToCart = (itemCode, quantity) => {
        try {
        call({"item_code" : itemCode, 'qty' : quantity ?? (cart[itemCode] ?? 0) + 1}).then(() => {
        mutateItemsList()
        })
        } catch (error) {
            console.log(error)
        }
    }

    const debouncedAddToCart = debounce(fectchToAddToCart, 500, 1);


    const cartCount = Object.keys(cart).reduce((total, itemCode) => {
        return total + cart[itemCode]
    }, 0)

    const { getByItemCode } = useProducts()

    useEffect(() => {
        // get cart state from local storage
        if(products.length == 0) return
        const cartStorage = localStorage.getItem('cart')
        if(!result && !loading &&  cartStorage )
        {

            const cartObject = JSON.parse(cartStorage);
            setCart(cartObject)
            if(!verifyCart(cartObject) && error?.httpStatus !== 403 )
            {
                resetBackEndCart()
                updateCart(cartObject)
                mutateItemsList()
            }
        }
    }, [products])

    function resetBackEndCart() {
        getProductsCodeInCart().forEach(async (product) => {
            try {
                await call({"item_code" : product, 'qty' : 0})
            } catch (error) {
                console.log(error)
            }
        }
        )
    }

    function verifyCart(cartObject) {
        const productCodes = getProductsCodeInCart();
        const allCartItemsExist = Object.keys(cartObject).every(itemCode => productCodes.includes(itemCode)) && productCodes.every(itemCode => Object.keys(cartObject).includes(itemCode));
        return  allCartItemsExist;
    }

    async function updateCart(cartObject) {
        for (const [itemCode, value] of Object.entries(cartObject)) {
            try {
                await call({"item_code" : itemCode, 'qty' : value})
            } catch (error) {
                console.log(error)
            }
        }
    }


    const setIsOpen = (value) => {
        if (value !== undefined || value !== null) {
            return _(value)
        }
        return _(!isOpen)
    }


    const addToCart = async (itemCode, quantity) => {
        setCart({ ...cart, [itemCode]: quantity ?? (cart[itemCode] ?? 0) + 1 })
        debouncedAddToCart(itemCode, quantity ?? (cart[itemCode] ?? 0) + 1)
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
        //window.location.reload()
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
