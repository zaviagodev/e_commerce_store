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
    SfIconChevronLeft
} from '@storefront-ui/react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useSetting } from '../hooks/useWebsiteSettings';
import { useNavigate } from 'react-router-dom';
import { useWish } from '../hooks/useWishe';
import ProductCard from '../components/ProductCard';
import LoadingImg from '../components/LoadingImg';
import { useState, useRef, useEffect } from 'react';
import { Skeleton } from '../components/Skeleton';
import { Icons } from '../components/icons';

const Product = () => {
    const { id } = useParams();
    const idFromUrl = useParams().itemsgroup;
    const [loaded, setLoaded] = useState([]);

    const handleImageLoad = (index) => {
        const updatedLoaded = [...loaded];
        updatedLoaded[index] = true;
        setLoaded(updatedLoaded);
    };

    
    const [openedAccordion, setOpenedAccordion] = useState([]);
    const isAccordionOpen = (id) => openedAccordion.includes(id);

    const handleToggleAccordion = (id) => (open) => {
        if (open) {
          setOpenedAccordion((current) => [...current, id]);
        } else {
          setOpenedAccordion((current) => current.filter((item) => item !== id));
        }
      };


    const { get, products,settingPage,getGroupedProducts,productinfo } = useProducts();
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
          summary: 'รายละเอียด',
          details:(product?.web_long_description && <div className='mb-4 whitespace-normal overflow-hidden' dangerouslySetInnerHTML={{ __html: product?.web_long_description }} />)
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

    const imageRef = useRef(null)

    const scrollToImage = (index) => {
        const targetImage = document.getElementById(`img-product-${index}`)
        if (targetImage){
            targetImage.scrollIntoView({behavior: 'smooth'})
        }
    }

    const filteredProducts = products.filter((productz) => productz?.item_group === product?.item_group).filter((productz) => productz?.item_code  != product?.item_code)
    const groupedProductsData = getGroupedProducts(product?.item_group)?.data;

    return (
        <main className='main-section-single-product'>
            <main className="flex flex-col lg:flex-row gap-[18px] lg:gap-[33px]"> {/* grid grid-cols-1 lg:grid-cols-2 */}
                {product?.website_image?.length > 0 || settingPage.default_product_image ? (
                <div className="relative flex w-full lg:gap-x-4">
                    <SfScrollable
                        className="hidden lg:flex relative !gap-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:!gap-y-4 cursor-pointer sticky top-4"
                        direction="vertical"
                        buttonsPlacement="none"
                        ref={thumbsRef}
                    >
                        <LoadingImg
                            ref={imageRef}
                            src={product?.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`}
                            className="h-[134px] w-[134px] min-w-[134px] object-cover fade-in"
                            aria-label={product?.website_image}
                            alt={product?.website_image}
                            onClick={() => scrollToImage(0)}
                        />
                        {product?.slider_images?.map((image, index) => (
                            <LoadingImg
                                ref={imageRef}
                                key={`img-product-${index + 1}`}
                                src={`${import.meta.env.VITE_ERP_URL ?? ''}${image}`}
                                className="h-[134px] w-[134px] min-w-[134px] object-cover fade-in"
                                aria-label={image}
                                alt={image}
                                onClick={() => scrollToImage(index + 1)}
                            />
                        ))}
                    </SfScrollable>
                    <SfScrollable
                        className="relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] !flex-row lg:!flex-col overflow-auto px-4 lg:px-0 w-full scroll-slide"
                        direction="vertical"
                        buttonsPlacement="none"
                        wrapperClassName='w-full !items-start lg:!items-center overflow-auto lg:overflow-visible'
                    >
                        {product?.discount ? (
                            <div className="absolute inline-flex items-center justify-center text-sm font-medium text-white bg-red-500 py-1 px-2 top-2 left-6 lg:left-2 rounded-xl z-[9]">
                                <Icons.tag01 className='mr-1.5'/>
                                {product?.discount}
                            </div>
                        ) : null}
                        <LoadingImg
                            ref={imageRef}
                            src={product?.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`}
                            className={`object-cover max-w-[500px] lg:w-full h-auto aspect-square fade-in ${product?.slider_images?.length > 0 ? 'w-[95%]' : 'w-full'}`}
                            aria-label={product?.website_image}
                            alt={product?.website_image}
                            id={`img-product-0`}
                        />

                        {product?.slider_images && product.slider_images.map((image, index) => (
                            <LoadingImg
                                ref={imageRef}
                                key={`img-product-${index + 1}`}
                                src={`${import.meta.env.VITE_ERP_URL ?? ''}${image}`}
                                className="object-cover max-w-[500px] w-[95%] lg:w-full h-auto aspect-square fade-in"
                                aria-label={image}
                                alt={image}
                                id={`img-product-${index + 1}`}
                            />
                        ))}
                    </SfScrollable>
                </div>
                ) : (
                    <div className='flex gap-4 px-4 lg:px-0'>
                        <div className='hidden lg:flex flex-col gap-y-4'>
                            <Skeleton className='aspect-square w-[134px] h-[134px]'/>
                            <Skeleton className='aspect-square w-[134px] h-[134px]'/>
                        </div>
                        <Skeleton className='aspect-square w-[500px] h-[500px]'/>
                    </div>
                )}

                <section className="w-full px-4 lg:px-10 lg:py-[30px] lg:max-w-[536px] h-full sticky top-0 z-10">
                    <div className='flex flex-col gap-y-3 lg:gap-y-[10px]'>
                        {product !== undefined ? (
                        <>
                            <h2 className='text-secgray text-sm'>หมวดหมู่สินค้า</h2>
                            <h1 className="font-semibold text-texttag text-[22px]">{product?.web_item_name}</h1>
                        </>
                        ) : (
                            <>
                                <Skeleton className='h-4 w-[300px]'/>
                                <Skeleton className='h-4 w-full'/>
                            </>
                        )}
                        {product !== undefined ? (
                            <span className='flex flex-row items-center justify-start gap-2 mb-3'>
                                <span className={`block typography-headline-3 font-bold text-base ${product?.formatted_mrp ? 'text-red-500' : 'text-primary'}`}>{product?.formatted_price}</span>
                                {product?.formatted_mrp && <span className="block text-maingray typography-headline-3 line-through font-normal text-sm">{product?.formatted_mrp}</span>}
                            </span>
                        ) : (<Skeleton className='h-4 w-[100px] mt-2'/>)}
                    </div>

                    {product !== undefined ? (
                        <div className='text-sm leading-6 pb-[60px] font-normal' dangerouslySetInnerHTML={{ __html: product?.short_description }} />
                    ) : (<Skeleton className='h-10 w-[300px] mt-2 mb-[60px]'/>)}

                    <div className="pb-6 border-gray-200 border-b">
                        <div className="items-start flex flex-col gap-y-[14px]">
                            {!hideCheckout && <div className="flex flex-col items-stretch inline-flex w-full">
                                {product !== undefined ? (
                                    <div className='flex items-center justify-between lg:justify-start w-full'>
                                        <p className='lg:hidden  text-maingray'>จำนวน</p>
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
                                    </div>
                                ) : (
                                    <Skeleton className='h-[50px] w-[111px]'/>
                                )}
                            </div>}                  
                            <div className='fixed bottom-0 left-0 bg-white lg:bg-inherit p-4 lg:p-0 lg:static flex lg:flex-col w-full gap-y-[14px] flex-col-reverse z-10'>
                                {product !== undefined || loading ? (
                                    <>
                                    <p className='text-[13px] text-center lg:text-left'>รับ Cashback สูงถึง ฿ 105 เมื่อเป็นสมาชิก</p>                           
                                    <div className='flex items-center gap-x-[10px] w-full'>
                                        
                                        {hideCheckout != 1 && (
                                                <SfButton disabled={loading || !product?.in_stock}  onClick={handleClickCart} type="button" size="lg" className="w-full btn-primary flex items-center gap-x-[10px] rounded-xl h-[50px]">
                                                    <Icons.shoppingBag01 color={loading || !product?.in_stock ? '#a1a1aa' : 'white'} className='w-[22px] h-[22px]'/>
                                                    {product?.in_stock ? buttonLabel : 'สินค้าหมด'}
                                                </SfButton>
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
                                    </>
                                ) : (
                                    <>
                                    <Skeleton className='h-[50px] w-full'/>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        {product !== undefined ? (
                            <>
                                {accordionItems.map(({id, summary, details}) => (
                                <>
                                    {details !== "" && (
                                        <SfAccordionItem 
                                            key={id} 
                                            summary={<div className={classNames('flex items-center justify-between p-4 pr-2', {'border-b': !isAccordionOpen(id)})}>
                                                <h2 className='font-semibold text-base'>{summary}</h2>
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
                                    )}
                                </>
                                ))}

                            <div className='w-full flex justify-center h-10 items-center mt-6'>
                                <button className='flex items-center gap-x-2 text-base font-semibold'>
                                    <Icons.messageQuestionCircle />
                                    ขอความช่วยเหลือ
                                </button>
                            </div>
                            </>
                        ) : (
                            <div className='flex flex-col gap-y-2 my-4'>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-6 w-full'/>
                                <Skeleton className='h-6 w-full'/>
                            </div>
                        )}
                    </div>
                </section>
            </main>

                    {groupedProductsData !== undefined ? (
                        <section className='px-4 lg:p-0 pt-[38px] lg:pt-[140px]'>
                            <h1 className='mb-8 text-primary text-lg lg:text-3xl font-semibold'>สินค้าที่คุณอาจสนใจ</h1>
                            <div className="grid gap-[14px] grid-cols-2 lg:grid-cols-4 place-items-center">
                                {groupedProductsData?.message?.items
    .filter(productz => productz?.item_code !== product?.item_code)
    .slice(0, 4)
    .map(product => (
        <ProductCard
            key={product.item_code}
            title={product.web_item_name}
            productId={product.name}
            description={product.short_description}
            itemCode={product.item_code}
            price={product.formatted_price}
            thumbnail={product.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`}
            salesPrice={product?.formatted_mrp}
            isGift={product?.item_group === "Gift" || product?.item_group === "Gift and Cards"}
        />
    ))
}

                            </div>
                        </section>
                    ) : (
                        <div className='flex flex-col gap-y-2 m-4 lg:m-0 lg:mt-[140px]'>
                            <div className='grid gap-[14px] grid-cols-2 lg:grid-cols-4 place-items-center w-full h-full'>
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