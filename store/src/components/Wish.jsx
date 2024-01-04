import React from 'react'
import {  SfDrawer, useTrapFocus, SfLoaderCircular } from '@storefront-ui/react'
import { CSSTransition } from 'react-transition-group';
import { useWish } from '../hooks/useWishe'
import { useProducts } from '../hooks/useProducts'
import { Link } from 'react-router-dom';

import { useRef } from 'react';

const Wish = () => {
    const { Wish, removeFromWish, isOpen, setIsOpen } = useWish()
    const nodeRef = useRef(null);
    const drawerRef = useRef(null);
    const { getByItemCode, isLoading } = useProducts()


    useTrapFocus(drawerRef, { activeState: isOpen });

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
                className="bg-neutral-50 border border-gray-300 w-1/3"
            >
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                            <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping Wish</h2>
                            <div className="ml-3 flex h-7 items-center">
                                <button onClick={() => setIsOpen(false)} type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Close panel</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flow-root">
                                <ul role="list" className="-my-6 divide-y divide-gray-200">
                                    {
                                        isLoading ? <SfLoaderCircular/> :
                                        Object.entries(Wish).map(([itemCode]) => {
                                            const product = getByItemCode(itemCode)
                                            return (
                                                <li key={itemCode} className="flex py-6">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <Link to={`/products/${product?.name}`} ><img src={product?.website_image} alt={product?.item_name} className="h-full w-full object-cover object-center" /></Link>
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <Link to={`/products/${product?.name}`} >{product?.web_item_name}</Link>
                                                                </h3>
                                                                <p className="ml-4">{product?.formatted_price}</p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">{product?.short_description}</p>
                                                        </div>

                                                        <div className="flex flex-1 items-center justify-between text-sm">
                                                            <div className="flex">
                                                                <button onClick={() => removeFromWish(itemCode)} type="button" className="font-medium text-primary-700 hover:text-primary-600">Remove</button>
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
                    </div>
                </div>
            </SfDrawer>
        </CSSTransition>

    );

    // return (
    //     <aside className={`w-1/4 p-4 fixed top-0 right-0 overflow-y-auto h-full transition-all ease-in-out duration-500 ${isOpen ? "" : "translate-x-full"}`}>
    //         <div className="relative">
    //             <div className="fixed overflow-hidden">
    //                 <div className="fixed  overflow-hidden">
    //                     <div className="pointer-events-none fixed inset-y-0 right-0 flex pl-10">

    //                         <div className="pointer-events-auto w-screen max-w-md">
    //                             <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
    //                                 <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
    //                                     <div className="flex items-start justify-between">
    //                                         <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping Wish</h2>
    //                                         <div className="ml-3 flex h-7 items-center">
    //                                             <button onClick={() => setIsOpen(false)} type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
    //                                                 <span className="sr-only">Close panel</span>
    //                                                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
    //                                                     <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    //                                                 </svg>
    //                                             </button>
    //                                         </div>
    //                                     </div>

    //                                     <div className="mt-8">
    //                                         <div className="flow-root">
    //                                             <ul role="list" className="-my-6 divide-y divide-gray-200">
    //                                                 {
    //                                                     Object.entries(Wish).map(([itemCode, qty]) => {
    //                                                         const product = getByItemCode(itemCode)
    //                                                         return (
    //                                                             <li key={itemCode} className="flex py-6">
    //                                                                 <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
    //                                                                     <img src={product?.website_image} alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." className="h-full w-full object-cover object-center" />
    //                                                                 </div>

    //                                                                 <div className="ml-4 flex flex-1 flex-col">
    //                                                                     <div>
    //                                                                         <div className="flex justify-between text-base font-medium text-gray-900">
    //                                                                             <h3>
    //                                                                                 <a href="#">{product?.name}</a>
    //                                                                             </h3>
    //                                                                             <p className="ml-4">{product?.formatted_price}</p>
    //                                                                         </div>
    //                                                                         <p className="mt-1 text-sm text-gray-500">Salmon</p>
    //                                                                     </div>

    //                                                                     <div className="flex flex-1 items-center justify-between text-sm">
    //                                                                         <div className="flex items-center justify-between mt-4 sm:mt-0">
    //                                                                             <div className="flex border border-neutral-300 rounded-md">
    //                                                                                 <SfButton
    //                                                                                     type="button"
    //                                                                                     variant="tertiary"
    //                                                                                     disabled={Wish[itemCode] === 1}
    //                                                                                     square
    //                                                                                     className="rounded-r-none"
    //                                                                                     aria-controls={null}
    //                                                                                     aria-label="Decrease value"
    //                                                                                     onClick={() => addToWish(itemCode, Wish[itemCode] - 1)}
    //                                                                                 >
    //                                                                                     <SfIconRemove />
    //                                                                                 </SfButton>
    //                                                                                 <input
    //                                                                                     type="number"
    //                                                                                     role="spinbutton"
    //                                                                                     className="appearance-none mx-2 w-8 text-center bg-transparent font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
    //                                                                                     value={Wish[itemCode]}
    //                                                                                     onChange={null}
    //                                                                                 />
    //                                                                                 <SfButton
    //                                                                                     type="button"
    //                                                                                     variant="tertiary"
    //                                                                                     square
    //                                                                                     className="rounded-l-none"
    //                                                                                     aria-controls={null}
    //                                                                                     aria-label="Increase value"
    //                                                                                     onClick={() => addToWish(itemCode)}
    //                                                                                 >
    //                                                                                     <SfIconAdd />
    //                                                                                 </SfButton>
    //                                                                             </div>
    //                                                                         </div>
    //                                                                         <div className="flex">
    //                                                                             <button onClick={() => removeFromWish(itemCode)} type="button" className="font-medium text-primary-700 hover:text-primary-600">Remove</button>
    //                                                                         </div>
    //                                                                     </div>
    //                                                                 </div>
    //                                                             </li>
    //                                                         )
    //                                                     })
    //                                                 }

    //                                             </ul>
    //                                         </div>
    //                                     </div>
    //                                 </div>

    //                                 <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
    //                                     <div className="flex justify-between text-base font-medium text-gray-900">
    //                                         <p>Subtotal</p>
    //                                         <p>฿ {getTotal()}</p>
    //                                     </div>
    //                                     <p className="my-1 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
    //                                     <SfButton className="w-full" disabled={WishCount == 0} onClick={() => { setIsOpen(false); navigate("/checkout"); }}>
    //                                         Checkout
    //                                     </SfButton>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </aside>
    // )

}

export default Wish