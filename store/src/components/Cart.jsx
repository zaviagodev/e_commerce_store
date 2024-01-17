import React, {useRef, useState} from 'react'
import { SfButton, SfDrawer, useTrapFocus, SfIconAdd, SfIconRemove, SfLoaderCircular, SfSelect, SfIconFavorite } from '@storefront-ui/react'
import { CSSTransition } from 'react-transition-group';
import { useWish } from '../hooks/useWishe'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, cartCount, addToCart, removeFromCart, getTotal, isOpen, setIsOpen, loading } = useCart()
    const { Wish, removeFromWish, isOpen: isWishOpen, setIsOpen: setWishOpen } = useWish()
    const nodeRef = useRef(null);
    const drawerRef = useRef(null);
    const { getByItemCode, isLoading } = useProducts()
    const navigate = useNavigate()

    // Ajouter un état pour l'intervalle
    const [intervalId, setIntervalId] = useState(null);


    const inputRefs = useRef({});


    const changeCart = (itemcode, qty) =>
    {
        let qtyStr = String(qty);
        if(qty == 0 || qty == '' || qty == null)
        {
            qtyStr = '1';
        }
        if(qtyStr.length > 3)
        {
            qtyStr = qtyStr.substring(1);
        }
        const qtyNum = Number(qtyStr);
        inputRefs.current[itemcode].value = qtyNum;
        addToCart(itemcode, qtyNum)
    }

    // Fonction pour commencer à augmenter la valeur
    const startIncreasing = (itemcode) => {
        const id = setInterval(() => {

            changeCart(itemcode, Number(inputRefs.current[itemcode].value) + 1);

        }, 100); // Augmenter la valeur toutes les 100 ms
        setIntervalId(id);
    };

    const startDecreasing = (itemcode) => {
        const id = setInterval(() => {
            
            changeCart(itemcode, Number(inputRefs.current[itemcode].value) - 1);

        }, 100); // Augmenter la valeur toutes les 100 ms
        setIntervalId(id);
    };



    // Fonction pour arrêter d'augmenter la valeur
    const stopIncreasing = () => {
        clearInterval(intervalId);
        setIntervalId(null);
    };

    
    //useTrapFocus(drawerRef, { activeState: isOpen });


    return (
        <CSSTransition
            ref={nodeRef}
            in={isOpen}
            timeout={500}
            unmountOnExit
            classNames={{
                enter: 'translate-x-full',
                enterActive: 'translate-x-0',
                enterDone: 'translate-x-0 transition duration-500 ease-in-out',
                exitDone: 'translate-x-0',
                exitActive: 'translate-x-full transition duration-500 ease-in-out',
            }}
        >
            <SfDrawer
                ref={drawerRef}
                placement='right'
                open
                onClose={() => setIsOpen(false)}
                className="bg-neutral-50 z-99 md:w-[375px] w-full box-border"
            >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-3 p-4 border-b">
                            <div className="flex h-7 items-center">
                                <button onClick={() => setIsOpen(false)} type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Close panel</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 text-center whitespace-pre" id="slide-over-title">Shopping cart</h2>
                            <div className="flex h-7 items-center justify-end">
                                <button onClick={() => {setIsOpen(false);setWishOpen(true)}} type="button">
                                    <SfIconFavorite />
                                </button>
                            </div>
                        </div>

                        {cartCount > 0 ? (
                            <div className="mt-4">
                            <div className="flow-root px-4">
                                <ul role="list" className="flex flex-col gap-y-8">
                                    {isLoading ? <SfLoaderCircular /> :
                                        Object.entries(cart).map(([itemCode]) => {
                                            const product = getByItemCode(itemCode)
                                            if (!inputRefs.current[itemCode]) {
                                                inputRefs.current[itemCode] = React.createRef();
                                                inputRefs.current[itemCode].value = Number(cart[itemCode]);
                                            }
                                            return (
                                                <li key={itemCode} className="flex">
                                                    <div className="h-32 w-24 flex-shrink-0 border border-gray-200">
                                                        <Link to={`/products/${product?.name}`}><img src={product?.website_image} alt={product?.item_name} className="h-full w-full object-cover object-center" /></Link>
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3 className='text-texttag hover:underline text-sm font-normal'>
                                                                    <Link to={`/products/${product?.name}`} >{product?.web_item_name}</Link>
                                                                </h3>
                                                                <p className="ml-4 whitespace-pre text-sm">{product?.formatted_price}</p>
                                                            </div>
                                                            {/* <p className="mt-1 text-sm text-gray-500">{product?.short_description}</p> */}
                                                        </div>

                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center justify-between mt-4 sm:mt-0">
                                                                <div className="flex border border-neutral-300 rounded-md">
                                                                    <SfButton
                                                                        type="button"
                                                                        variant="tertiary"
                                                                        disabled={Number(inputRefs.current[itemCode].value) == 1 || loading}
                                                                        square
                                                                        className="rounded-r-none"
                                                                        aria-controls={null}
                                                                        aria-label="Decrease value"
                                                                        onClick={(event) => changeCart(itemCode, Number(inputRefs.current[itemCode].value) - 1 )}
                                                                        onMouseDown={() => startDecreasing(itemCode)}
                                                                        onMouseUp={stopIncreasing}
                                                                        onMouseLeave={stopIncreasing}
                                                                    >
                                                                        <SfIconRemove />
                                                                    </SfButton>
                                                                    <input
                                                                        ref={el => inputRefs.current[itemCode] = el}
                                                                        id={itemCode}
                                                                        type="number"
                                                                        role="spinbutton"
                                                                        className="outline-none z-10 appearance-none mx-2 w-8 text-center bg-transparent font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900"
                                                                        min={1}
                                                                        max={999}
                                                                        value={cart[itemCode]}
                                                                        onChange={(event) => changeCart(itemCode, Number(event.target.value))}
                                                                    />
                                                                    <SfButton
                                                                        type="button"
                                                                        variant="tertiary"
                                                                        disabled={Number(inputRefs.current[itemCode].value) == 999 || loading}
                                                                        square
                                                                        className="rounded-l-none"
                                                                        aria-controls={null}
                                                                        aria-label="Increase value"
                                                                        onClick={(event) => changeCart(itemCode, Number(inputRefs.current[itemCode].value) + 1 )}
                                                                        onMouseDown={() => startIncreasing(itemCode)}
                                                                        onMouseUp={stopIncreasing}
                                                                        onMouseLeave={stopIncreasing}

                                                                    >
                                                                        <SfIconAdd />
                                                                    </SfButton>
                                                                </div>
                                                            </div>
                                                            <div className="flex">
                                                                <button disabled={loading} onClick={() => removeFromCart(itemCode)} type="button" className="font-medium text-secondary disabled:text-maingray disabled:cursor-not-allowed">Remove</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        ) : (
                            <div className="h-1/2 text-center flex flex-col gap-y-3 justify-end">
                                <h1 className='font-bold text-xl'>Your cart is empty</h1>
                                <p>Go to the store to browse the products.</p>
                                <Link to='/home/all%20items'>
                                    <SfButton onClick={() => setIsOpen(false)} className='btn-primary'>Shop now</SfButton>
                                </Link>
                            </div>
                        )}
                    </div>

                    {cartCount > 0 && (
                        <div className="border-t border-gray-200 p-4">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>฿ {getTotal()}</p>
                        </div>
                        <p className="my-3 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <SfButton className="w-full btn-primary" disabled={cartCount == 0} onClick={() => { setIsOpen(false); navigate("/checkout"); }}>
                            {loading ? <SfLoaderCircular/> :  'Checkout'}
                        </SfButton>
                    </div>
                    )}
                </div>
            </SfDrawer>
        </CSSTransition>
    );
}

export default Cart