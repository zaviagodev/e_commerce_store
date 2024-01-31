import React, {useEffect,useRef, useState} from 'react'
import { SfButton, SfDrawer, useTrapFocus, SfIconAdd, SfIconRemove, SfLoaderCircular, SfSelect, SfIconFavorite } from '@storefront-ui/react'
import { CSSTransition } from 'react-transition-group';
import { useWish } from '../hooks/useWishe'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { Icons } from './icons';
import { Skeleton } from './Skeleton';
import { useFrappePostCall } from 'frappe-react-sdk';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useSetting } from '../hooks/useWebsiteSettings';

const Cart = () => {
    const { cart, cartCount, addToCart, removeFromCart, getTotal, isOpen, setIsOpen, loading } = useCart()
    const { Wish, removeFromWish, isOpen: isWishOpen, setIsOpen: setWishOpen } = useWish()
    const nodeRef = useRef(null);
    const drawerRef = useRef(null);
    const { getByItemCode, isLoading } = useProducts()
    const navigate = useNavigate()
    const { call, isCompleted } = useFrappePostCall('webshop.webshop.api.update_cart')
    const { currentUser,updateCurrentUser } = useFrappeAuth();
    const { hideWish} = useSetting()

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
    const handlecheckout = () => {
        updateCurrentUser();
        console.log('fff');
        console.log(currentUser);
        
        // if(!currentUser){
        //     navigate("/login");
        // }
        // else{
        //      //call({"cart":cart});
        //     navigate("/checkout");
        // }
    };

    //useTrapFocus(drawerRef, { activeState: isOpen });

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
                            <h2 className="font-semibold text-gray-900 text-center whitespace-pre col-span-2" id="slide-over-title">ตะกร้าสินค้า</h2>
                                <div className="flex h-7 items-center justify-end">
                                    {hideWish != 1 && (
                                        <button onClick={() => { setIsOpen(false); setWishOpen(true) }} type="button">
                                        <SfIconFavorite />
                                        </button>
                                    )}
                                </div>

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
                            {cartCount > 0 ? (
                            <div className="mt-6">
                                <div className="flow-root px-6">
                                    <ul role="list" className="flex flex-col gap-y-9">
                                        {Object.entries(cart).map(([itemCode]) => {
                                                const product = getByItemCode(itemCode)
                                                if (!inputRefs.current[itemCode]) {
                                                    inputRefs.current[itemCode] = React.createRef();
                                                    inputRefs.current[itemCode].value = Number(cart[itemCode]);
                                                }
                                                return (
                                                    <li key={itemCode} className="flex">
                                                        <div className="h-[90px] min-w-[90px]">
                                                            <Link to={`/products/${product?.name}`}>
                                                                {product?.website_image ? (
                                                                    <img src={`${import.meta.env.VITE_ERP_URL ?? ""}${product?.website_image}`} alt={product?.item_name} className="h-full w-full object-cover object-center" />
                                                                ) : (
                                                                    <div className='w-[90px] h-[90px] bg-gray-200'/>
                                                                )}
                                                            </Link>
                                                        </div>

                                                        <div className="ml-[10px] flex flex-1 flex-col justify-between">
                                                            <div>
                                                                <div className="flex justify-between text-gray-900">
                                                                    <h3 className='text-texttag hover:underline text-[13px] leading-[17px]'>
                                                                        <Link to={`/products/${product?.name}`} >{product?.web_item_name}</Link>
                                                                    </h3>
                                                                    <p className="ml-4 whitespace-pre text-sm font-semibold">{product?.formatted_price}</p>
                                                                </div>
                                                                {/* <p className="mt-1 text-base text-gray-500">{product?.short_description}</p> */}
                                                            </div>

                                                            <div className="flex items-center justify-between text-base">
                                                                <div className="flex items-center justify-between mt-4 sm:mt-0">
                                                                    <div className="flex rounded-[7px] bg-[#F3F3F3]">
                                                                        <SfButton
                                                                            type="button"
                                                                            variant="tertiary"
                                                                            disabled={Number(inputRefs.current[itemCode].value) == 1 || loading}
                                                                            square
                                                                            className="rounded-r-none px-2 text-secgray"
                                                                            aria-controls={null}
                                                                            aria-label="Decrease value"
                                                                            onClick={() => changeCart(itemCode, Number(inputRefs.current[itemCode].value) - 1 )}
                                                                            // onMouseDown={() => startDecreasing(itemCode)}
                                                                            // onMouseUp={stopIncreasing}
                                                                            // onMouseLeave={stopIncreasing}
                                                                        >
                                                                            <Icons.minus color='#979797'/>
                                                                        </SfButton>
                                                                        <input
                                                                            id={itemCode}
                                                                            type="number"
                                                                            role="spinbutton"
                                                                            className="text-sm text-secgray outline-none z-10 appearance-none w-6 h-[33px] text-center bg-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900"
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
                                                                            className="rounded-l-none px-2 text-secgray"
                                                                            aria-controls={null}
                                                                            aria-label="Increase value"
                                                                            onClick={() => changeCart(itemCode, Number(inputRefs.current[itemCode].value) + 1 )}
                                                                            // onMouseDown={() => startIncreasing(itemCode)}
                                                                            // onMouseUp={stopIncreasing}
                                                                            // onMouseLeave={stopIncreasing}

                                                                        >
                                                                            <Icons.plus color='#979797'/>
                                                                        </SfButton>
                                                                    </div>
                                                                </div>
                                                                <div className="flex">
                                                                    <button disabled={loading} onClick={() => removeFromCart(itemCode)} type="button" className="font-medium text-secondary disabled:text-maingray disabled:cursor-not-allowed">
                                                                        <Icons.trash01 color='#979797' className='w-5 h-5'/>
                                                                    </button>
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
                                <div className="h-1/2 text-center flex flex-col gap-y-3 justify-end px-4">
                                    <h1 className='font-bold text-lg'>ตะกร้าของคุณว่างเปล่า</h1>
                                    <p className='text-base'>ไปยังร้านค้าเพื่อเลือกสินค้า</p>
                                    <Link to='/home/all%20items'>
                                        <SfButton onClick={() => setIsOpen(false)} className='btn-primary rounded-xl font-semibold'>เลือกซื้อสินค้า</SfButton>
                                    </Link>
                                </div>
                            )}
                            </>
                        )}
                        
                    </div>

                    {cartCount > 0 && (
                        <div className="p-6 pb-[10px] flex flex-col gap-y-9">
                        {getTotal() ? (
                            <>
                            <div className="flex justify-between text-basesm font-semibold text-gray-900 leading-[10px]">
                                <p>ราคาสินค้าทั้งหมด</p>
                                <p>฿ {getTotal().toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                            </div>
                            <div className='flex flex-col gap-y-4'>
                                <SfButton className="w-full btn-primary h-[50px] flex items-center gap-x-[10px] rounded-xl" disabled={cartCount == 0 || loading} onClick={() => { handlecheckout(); }}>
                                    ชำระเงิน
                                    <Icons.shoppingBag01 color={loading ? '#a1a1aa' : 'white'} className='w-[22px] h-[22px]'/>
                                </SfButton>  
                                <p className="text-sm text-center text-gray-500">ค่าจัดส่งและภาษีมูลค่าเพิ่ม (ถ้ามี) จะคำนวณเมื่อชำระเงิน</p>
                            </div>
                            </>
                        ) : (
                            <div className='flex flex-col gap-y-2'>
                                <Skeleton className='h-4 w-full'/>
                                <Skeleton className='h-[50px] w-full'/>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </SfDrawer>
        </CSSTransition>
    );
}

export default Cart
