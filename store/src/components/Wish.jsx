import React from 'react'
import {  SfDrawer, useTrapFocus, SfLoaderCircular, SfButton } from '@storefront-ui/react'
import { CSSTransition } from 'react-transition-group';
import { useWish } from '../hooks/useWishe'
import { useProducts } from '../hooks/useProducts'
import { Link } from 'react-router-dom';

import { useRef } from 'react';
import { Icons } from './icons';
import { Skeleton } from './Skeleton';

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
            timeout={200}
            unmountOnExit
            classNames={{
                enter: 'opacity-0',
                enterActive: 'opacity-1',
                enterDone: 'opacity-1 transition duration-200 ease-in-out',
                exitDone: 'opacity-1',
                exitActive: 'opacity-0 transition duration-200 ease-in-out',
            }}
        >
            <SfDrawer
                ref={drawerRef}
                placement='right'
                open
                onClose={() => setIsOpen(false)}
                className="bg-neutral-50 z-99 md:w-[408px] w-full box-border"
            >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-4 px-3 py-[14px] border-b border-b-[#F4F4F4] items-center">
                            <div className="flex h-7 items-center">
                                <button onClick={() => setIsOpen(false)} type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Close panel</span>
                                    <Icons.flipBackward />
                                </button>
                            </div>
                            <h2 className=" font-semibold text-gray-900 text-center whitespace-pre col-span-2 leading-[11px]" id="slide-over-title">รายการสินค้าที่สนใจของฉัน</h2>
                        </div>
                        {isLoading ? (
                            <div className='flex gap-x-2 p-6'>
                                <Skeleton className='h-[90px] min-w-[90px]'/>
                                <div className='flex justify-between w-full'>
                                    <Skeleton className='h-4 w-[100px]'/>
                                    <Skeleton className='h-4 w-10'/>
                                </div>
                            </div>
                        ) : (
                            <>
                            {Object.entries(Wish).length > 0 ?
                                (<div>
                                    <div className="flow-root p-6">
                                        <ul role="list" className="flex flex-col gap-y-9">
                                            {Object.entries(Wish).map(([itemCode]) => {
                                                const product = getByItemCode(itemCode)
                                                    return (
                                                    <li key={itemCode} className="flex">
                                                        <div className="h-[90px] w-[90px] flex-shrink-0">
                                                            <Link to={`/products/${product?.name}`} >
                                                            {product?.website_image ? (
                                                                <img src={`${import.meta.env.VITE_ERP_URL ?? ""}${product?.website_image}`} alt={product?.item_name} className="h-full w-full object-cover object-center" />
                                                            ) : (
                                                                <div className='w-[90px] h-[90px] bg-gray-200'/>
                                                            )}
                                                            </Link>
                                                        </div>

                                                        <div className="ml-[10px] flex flex-1 flex-col justify-between">
                                                            <div className="flex justify-between text-gray-900">
                                                                <h3 className='text-texttag hover:underline text-[13px] leading-[17px] font-normal'>
                                                                    <Link to={`/products/${product?.name}`} >{product?.web_item_name}</Link>
                                                                </h3>
                                                                <p className="ml-4 whitespace-pre text-sm font-semibold">{product?.formatted_price}</p>
                                                            </div>

                                                            <div className="flex text-base justify-end">
                                                                <button onClick={() => removeFromWish(itemCode)} type="button" className="text-secondary">
                                                                    <Icons.trash01 color='#979797' className='w-5 h-5'/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                            }
                                        </ul>
                                    </div>
                                </div>) : (
                                    <div className="h-1/2 text-center flex flex-col gap-y-3 justify-end px-6">
                                        <h1 className='font-bold text-lg'>ยังไม่มีรายการสินค้าที่สนใจ</h1>
                                        <p className='text-base'>เริ่มบันทึกสินค้าที่สนใจโดยกดปุ่มหัวใจ</p>
                                        <Link to='/home/all%20items'>
                                            <SfButton onClick={() => setIsOpen(false)} className='btn-primary font-semibold'>เริ่มเลือกสินค้า</SfButton>
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                        
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
    //                                                                         <p className="mt-1 text-base text-gray-500">Salmon</p>
    //                                                                     </div>

    //                                                                     <div className="flex flex-1 items-center justify-between text-base">
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
    //                                     <p className="my-1 text-base text-gray-500">Shipping and taxes calculated at checkout.</p>
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