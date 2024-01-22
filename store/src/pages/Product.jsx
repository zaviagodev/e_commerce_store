import {
    SfAccordionItem,
    SfLoaderCircular,
    SfScrollable,
} from '@storefront-ui/react';
import { useCounter } from 'react-use';
import { clamp } from '@storefront-ui/shared';
import classNames from 'classnames'
import {
    SfButton,
    SfLink,
    SfIconShoppingCart,
    SfIconSell,
    SfIconPackage,
    SfIconRemove,
    SfIconAdd,
    SfIconWarehouse,
    SfIconSafetyCheck,
    SfIconShoppingCartCheckout,
    SfIconFavoriteFilled,
    SfIconFavorite,
    SfIconChevronLeft
} from '@storefront-ui/react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useSetting } from '../hooks/useWebsiteSettings';
import { useNavigate } from 'react-router-dom';
import { useWish } from '../hooks/useWishe';
import ProductCard from '../components/ProductCard';
import { useState, useRef } from 'react';
import { Skeleton } from '../components/Skeleton';
import { Icons } from '../components/icons';

const Product = () => {
    const { id } = useParams();
    const idFromUrl = useParams().itemsgroup;


    const [openedAccordion, setOpenedAccordion] = useState([]);
    const isAccordionOpen = (id) => openedAccordion.includes(id);

    const handleToggleAccordion = (id) => (open) => {
        if (open) {
          setOpenedAccordion((current) => [...current, id]);
        } else {
          setOpenedAccordion((current) => current.filter((item) => item !== id));
        }
      };


    const { get, products,settingPage } = useProducts();

    const {hideCheckout, buttonLabel, buttonLink} = useSetting();

    const { cart, addToCart, loading, isOpen, setIsOpen } = useCart();
    
    const product = get(id);
    const inputId = "useId('input')";
    const min = 1;
    const max = 999;
    const [value, { inc, dec, set }] = useCounter(min);
    const navigate = useNavigate();

    console.log(product)

    function handleOnChange(event) {
        const { value: currentValue } = event.target;
        const nextValue = parseFloat(currentValue);
        set(Number(clamp(nextValue, min, max)));
    }

    function handleClickCart() {
        addToCart(product?.item_code, cart[product?.item_code] ? cart[product?.item_code] + value : value)
        if(hideCheckout){
            if(!buttonLink.startsWith('/')) window.location.href = `https://${buttonLink}`
            else navigate(buttonLink)
            return
        }
        setIsOpen(true)
    }

    const { Wish,addToWish, removeFromWish, setIsOpen:setWishOpen } = useWish()
    const { hideWish} = useSetting()

    const handleWish = (e) => {
        e.preventDefault();
        if (Wish[product?.item_code]) {
            removeFromWish(product?.item_code)
        } else {
            addToWish(product?.item_code);
            setWishOpen(true)
        }
    }

    const accordionItems = [
        {
          id: 'acc-1',
          summary: 'รายละเอียด',
          details:(<div className='mb-4 whitespace-normal overflow-hidden' dangerouslySetInnerHTML={{ __html: product?.web_long_description }} />)
        },
      ];

    const thumbsRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const onDragged = (event) => {
        if (event.swipeRight && activeIndex > 0) {
          setActiveIndex((currentActiveIndex) => currentActiveIndex - 1);
        } else if (event.swipeLeft && activeIndex < images.length - 1) {
          setActiveIndex((currentActiveIndex) => currentActiveIndex + 1);
        }
      };

    return (
        <main className='main-section-single-product'>
            <main className="flex flex-col lg:flex-row gap-[33px]"> {/* grid grid-cols-1 lg:grid-cols-2 */}
                {product?.website_image?.length > 0 ? (
                <div className="relative flex w-full gap-x-4">
                    <SfScrollable
                        className="relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] !gap-y-4"
                        direction="vertical"
                        buttonsPlacement="none"
                        drag={{ containerWidth: true }}
                        ref={thumbsRef}
                    >
                        {product?.slider_images?.map((image, index) => (
                            <img
                                src={`${import.meta.env.VITE_ERP_URL ?? ''}${image}`}
                                className="h-[134px] w-[134px] min-w-[134px] object-cover"
                                aria-label={image}
                                alt={image}
                                id={`img-product-${index}`}
                                key={`img-product-${index}`}
                            />
                        ))}
                    </SfScrollable>
                    <SfScrollable
                        className="relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        direction="vertical"
                        buttonsPlacement="none"
                        drag={{ containerWidth: true }}
                    >
                        {product?.discount ? (
                            <div className="absolute inline-flex items-center justify-center text-sm font-medium text-muted bg-destructive py-1 px-2 top-2 left-2 rounded-md">
                                <SfIconSell size="sm" className="mr-1.5" />
                                {product?.discount}
                            </div>
                        ) : null}
                        <img
                            src={product.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`}
                            className="object-cover w-[500px] h-auto aspect-square"
                            aria-label={product?.website_image}
                            alt={product?.website_image}
                        />

                        {product?.slider_images && product.slider_images.map((image, index) => (
                            <img
                                key={index}
                                src={`${import.meta.env.VITE_ERP_URL ?? ''}${image}`}
                                className="object-cover w-[500px] h-auto aspect-square"
                                aria-label={image}
                                alt={image}
                            />
                        ))}
                    </SfScrollable>
                </div>
                ) : (<Skeleton className='aspect-square w-full h-full'/>)}

                <section className="w-full px-10 py-[30px] lg:max-w-[536px]">
                    <div className='flex flex-col gap-y-[14px]'>
                        {product !== undefined ? (
                        <>
                            <h2 className='text-secgray text-sm font-medium leading-[9px]'>หมวดหมู่สินค้า</h2>
                            <h1 className="font-bold text-texttag text-lg">{product?.item_name}</h1>
                        </>
                        ) : (<Skeleton className='h-4 w-[300px]'/>)}
                        {product !== undefined ? (
                            <span className='flex flex-row items-center justify-start gap-2 mb-4'>
                                <strong className={`block typography-headline-3 text-base ${product?.formatted_mrp ? 'text-destructive' : 'text-primary'}`}>{product?.formatted_price}</strong>
                                {product?.formatted_mrp && <span className="block text-maingray typography-headline-3 line-through font-medium text-base">{product?.formatted_mrp}</span>}
                            </span>
                        ) : (<Skeleton className='h-4 w-[100px] mt-2'/>)}
                    </div>

                    {product !== undefined ? (
                        <div className='text-[20px] leading-6 pb-[60px] font-medium' dangerouslySetInnerHTML={{ __html: product?.short_description }} />
                    ) : (<Skeleton className='h-10 w-[300px] mt-2 mb-[60px]'/>)}

                    <div className="pb-6 border-gray-200 border-b">
                        {product !== undefined ? (<div className="items-start flex flex-col gap-y-[14px]">
                            {!hideCheckout && <div className="flex flex-col items-stretch xs:items-center xs:inline-flex">
                                <div className="flex bg-[#F3F3F3] rounded-xl items-center">
                                    <SfButton
                                        type="button"
                                        variant="tertiary"
                                        square
                                        className="rounded-r-none p-4 text-secgray"
                                        disabled={value <= min || !product?.in_stock}
                                        aria-controls={inputId}
                                        aria-label="Decrease value"
                                        onClick={() => dec()}
                                    >
                                        <Icons.minus color='#979797'/>
                                    </SfButton>
                                    <input
                                        id={inputId}
                                        type="number"
                                        role="spinbutton"
                                        className="text-secgray grow appearance-none text-base w-6 h-[50px] text-center bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
                                        min={min}
                                        max={max}
                                        value={value}
                                        onChange={handleOnChange}
                                        disabled={!product?.in_stock}
                                    />
                                    <SfButton
                                        type="button"
                                        variant="tertiary"
                                        square
                                        className="rounded-l-none p-4 text-secgray"
                                        disabled={value >= max || !product?.in_stock}
                                        aria-controls={inputId}
                                        aria-label="Increase value"
                                        onClick={() => inc()}
                                    >
                                        <Icons.plus color='#979797'/>
                                    </SfButton>
                                </div>
                            </div>}
                            <p className='text-basesm'>รับ Cashback สูงถึง ฿ 105 เมื่อเป็นสมาชิก</p>
                            <div className='flex items-center gap-x-[10px] w-full'>
                                {product !== undefined ? (                                
                                    <>
                                        <SfButton disabled={loading || !product?.in_stock}  onClick={handleClickCart} type="button" size="lg" className="w-full btn-primary flex items-center gap-x-[10px] rounded-xl h-[50px]">
                                            <Icons.shoppingBag01 color='white' className='w-[22px] h-[22px]'/>
                                            {product?.in_stock ? buttonLabel : 'Sold out'}
                                        </SfButton>
                                    </>
                                ) : (
                                    <Skeleton className='h-[50px] w-full'/>
                                )}

                                {!hideWish && <SfButton
                                    onClick={handleWish} 
                                    type="button"
                                    variant="tertiary"
                                    size="sm"
                                    square
                                    className="bg-white z-50 border-2 border-black p-[10px] rounded-xl w-[57px] min-w-[57px] h-[50px]"
                                    aria-label="Add to wishlist"
                                >
                                    {Wish[product?.item_code] == 1 ? (
                                        <Icons.heart className='w-6 h-6' fill='black'/>
                                    ) : (
                                        <Icons.heart className='w-6 h-6' />
                                    )}
                                </SfButton>}
                            </div>
                        </div>) : (
                            <Skeleton className='h-12 w-full'/>
                        )}
                    </div>
                    <div>
                        {product !== undefined ? (
                            <>
                                {accordionItems.map(({id, summary, details}) => (
                                <SfAccordionItem 
                                    key={id} 
                                    summary={<div className={classNames('flex items-center justify-between p-4 pr-2', {'border-b': !isAccordionOpen(id)})}>
                                        <h2 className='font-medium text-base'>{summary}</h2>
                                        <SfIconChevronLeft
                                            className={classNames('text-black w-8 h-8', {
                                            'rotate-90': isAccordionOpen(id),
                                            '-rotate-90': !isAccordionOpen(id),
                                            })}
                                        />
                                    </div>}
                                    onToggle={handleToggleAccordion(id)}
                                    open={isAccordionOpen(id)}
                                >
                                    <div className={classNames('p-4 pt-0 border-b text-base')}>
                                        {details}
                                    </div>
                                </SfAccordionItem>
                                ))}
                            </>
                        ) : (
                            <div className='flex flex-col gap-y-2 my-4'>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-6 w-full'/>
                            </div>
                        )}
                        <div className='w-full flex justify-center h-10 items-center mt-6'>
                            <button className='flex items-center gap-x-2 text-base font-medium'>
                                <Icons.messageQuestionCircle />
                                ขอความช่วยเหลือ
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        
            {products?.length > 0 ? (
                <section className='pt-20'>
                <h1 className='mb-8 text-primary text-center text-xl font-bold'>สินค้าที่คุณอาจสนใจ</h1>
                <div
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 place-items-center"
                    >

                        {console.log(products)}
                        {products
                        .filter((productz) => productz?.item_group === product?.item_group)
                        .slice(0, 4)
                        .map((product) => (
                            <ProductCard
                                key={product.item_code}
                                title={product.web_item_name}
                                productId={product.name}
                                description={product.short_description}
                                itemCode={product.item_code}
                                price={product.formatted_price}
                                thumbnail={`${import.meta.env.VITE_ERP_URL ?? ''}${product.website_image}`}
                                salesPrice={product?.formatted_mrp}
                                isGift={product?.item_group === "Gift" || product?.item_group === "Gift and Cards"}
                            />
                        )).slice(0,4)}
                </div>
            </section>
            ) : (
            <div className='flex flex-col gap-y-2 mt-20'>
                <div className='grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4 place-items-center w-full h-full'>
                    <Skeleton className='h-full w-full aspect-square'/>
                    <Skeleton className='h-full w-full aspect-square'/>
                    <Skeleton className='h-full w-full aspect-square'/>
                    <Skeleton className='h-full w-full aspect-square'/>
                </div>
            </div>
            )}
        </main>
    )
}

export default Product