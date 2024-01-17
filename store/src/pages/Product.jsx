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

    const { get, products } = useProducts();
    const {hideCheckout, buttonLabel, buttonLink} = useSetting();

    const { cart, addToCart, loading, isOpen, setIsOpen } = useCart();
    
    const product = get(id);
    const inputId = "useId('input')";
    const min = 1;
    const max = 999;
    const [value, { inc, dec, set }] = useCounter(min);
    const navigate = useNavigate();

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
          summary: 'Long description',
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
        <main className='main-section'>
            <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[50px] xl:gap-x-[94px]">
                {product?.website_image ? (
                <div className="relative flex w-full gap-x-2">
                    <SfScrollable
                        className="relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] !gap-y-2"
                        direction="vertical"
                        buttonsPlacement="none"
                        drag={{ containerWidth: true }}
                        ref={thumbsRef}
                    >
                        {product?.slider_images?.map((image, index) => (
                            <img
                                src={`${import.meta.env.VITE_ERP_URL ?? ''}${image}`}
                                className="h-32 w-24 min-w-[96px] object-cover"
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
                            src={`${import.meta.env.VITE_ERP_URL ?? ''}${product?.website_image}`}
                            className="object-contain w-auto h-full"
                            aria-label={product?.website_image}
                            alt={product?.website_image}
                        />
                    </SfScrollable>
                </div>
                ) : (<Skeleton className='aspect-[3/4] w-full h-full'/>)}

                <section className="mt-4 w-full lg:max-w-[486px]">
                    <div className='flex flex-col gap-y-[14px]'>
                        {product?.item_name ? (
                        <>
                            <h2 className='text-[#979797] text-sm font-medium'>หมวดหมู่สินค้า</h2>
                            <h1 className="font-bold typography-headline-4 text-texttag text-lg">
                                {product?.item_name}
                            </h1>
                        </>
                        ) : (<Skeleton className='h-4 w-[300px]'/>)}
                        {product?.formatted_price ? (
                            <span className='flex flex-row items-center justify-start gap-2 mb-4'>
                                <strong className={`block typography-headline-3 text-base ${product?.formatted_mrp ? 'text-destructive' : 'text-primary'}`}>{product?.formatted_price}</strong>
                                {product?.formatted_mrp && <span className="block text-maingray typography-headline-3 line-through font-medium text-base">{product?.formatted_mrp}</span>}
                            </span>
                        ) : (<Skeleton className='h-4 w-[100px] mt-2'/>)}
                    </div>

                    {product?.short_description ? (
                        <div className='text-base' dangerouslySetInnerHTML={{ __html: product?.short_description }} />
                    ) : (<Skeleton className='h-10 w-[300px] mt-2'/>)}

                    <div className="pt-4 pb-6 border-gray-200 border-b">
                        {product?.in_stock ? (<div className="items-start flex flex-col gap-y-[14px]">
                            {!hideCheckout && <div className="flex flex-col items-stretch xs:items-center xs:inline-flex">
                                <div className="flex border border-neutral-300 rounded-md">
                                    <SfButton
                                        type="button"
                                        variant="tertiary"
                                        square
                                        className="rounded-r-none p-3"
                                        disabled={value <= min || !product?.in_stock}
                                        aria-controls={inputId}
                                        aria-label="Decrease value"
                                        onClick={() => dec()}
                                    >
                                        <SfIconRemove />
                                    </SfButton>
                                    <input
                                        id={inputId}
                                        type="number"
                                        role="spinbutton"
                                        className="grow appearance-none text-base mx-2 w-8 text-center bg-transparent font-medium outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
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
                                        className="rounded-l-none p-3"
                                        disabled={value >= max || !product?.in_stock}
                                        aria-controls={inputId}
                                        aria-label="Increase value"
                                        onClick={() => inc()}
                                    >
                                        <SfIconAdd />
                                    </SfButton>
                                </div>
                            </div>}
                            <div className='flex items-center gap-x-[10px] w-full'>
                                <SfButton disabled={loading || !product?.in_stock}  onClick={handleClickCart} type="button" size="lg" className="w-full btn-primary">
                                    {loading ? <Skeleton className='h-6 w-full'/> : product?.in_stock ? buttonLabel : 'Sold out'}
                                </SfButton>
                                {!hideWish && <SfButton
                                    onClick={handleWish} 
                                    type="button"
                                    variant="tertiary"
                                    size="sm"
                                    square
                                    className="bg-white z-50 border-2 border-black p-[10px]"
                                    aria-label="Add to wishlist"
                                >
                                    {Wish[product?.item_code] == 1 ? (
                                        <SfIconFavoriteFilled className='w-6 h-6'/>
                                    ) : (
                                        <SfIconFavorite className='w-6 h-6' />
                                    )}
                                </SfButton>}
                            </div>
                        </div>) : (
                            <Skeleton className='h-12 w-full'/>
                        )}
                    </div>
                    <div>
                        {product?.web_long_description ? (
                            <>
                                {accordionItems.map(({id, summary, details}) => (
                                <SfAccordionItem 
                                    key={id} 
                                    summary={<div className={classNames('flex items-center justify-between py-4', {'border-b': !isAccordionOpen(id)})}>
                                        <h2 className='font-medium text-base'>{summary}</h2>
                                        <SfIconChevronLeft
                                            className={classNames('text-neutral-500', {
                                            'rotate-90': isAccordionOpen(id),
                                            '-rotate-90': !isAccordionOpen(id),
                                            })}
                                        />
                                    </div>}
                                    onToggle={handleToggleAccordion(id)}
                                    open={isAccordionOpen(id)}
                                >
                                    <div className={classNames('pb-4 border-b text-base')}>
                                        {details}
                                    </div>
                                </SfAccordionItem>
                                ))}
                            </>
                        ) : (
                            <div className='flex flex-col gap-y-2 mt-4'>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-6 w-full'/>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        
            {products !== undefined && products?.length > 0 ? (
                <section className='pt-20'>
                <h1 className='mb-8 text-primary text-center text-xl font-bold'>สินค้าที่คุณอาจสนใจ</h1>
                <div
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center"
                    >
                        {products?.map((product) => (
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
                        ))}
                </div>
            </section>
            ) : (
                <div className='flex flex-col gap-y-2 mt-20'>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center w-full h-full gap-3'>
                    <Skeleton className='h-full w-full aspect-[3/4]'/>
                    <Skeleton className='h-full w-full aspect-[3/4]'/>
                    <Skeleton className='h-full w-full aspect-[3/4]'/>
                    <Skeleton className='h-full w-full aspect-[3/4]'/>
                </div>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center w-full h-full gap-3'>
                    <Skeleton className='h-4 w-full'/>
                    <Skeleton className='h-4 w-full'/>
                    <Skeleton className='h-4 w-full'/>
                    <Skeleton className='h-4 w-full'/>
                </div>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center w-full h-full gap-3'>
                    <Skeleton className='h-4 w-full'/>
                    <Skeleton className='h-4 w-full'/>
                    <Skeleton className='h-4 w-full'/>
                    <Skeleton className='h-4 w-full'/>
                </div>
            </div>
            )}
        </main>
    )
}

export default Product