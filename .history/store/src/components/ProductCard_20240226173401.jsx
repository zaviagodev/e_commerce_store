import React from 'react'
import { useState } from "react";
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom';
import { SfButton, SfRating, SfCounter, SfLink, SfIconShoppingCart, SfIconFavorite, SfLoaderCircular, SfIconSell, SfIconFavoriteFilled } from '@storefront-ui/react';
import { useCart } from '../hooks/useCart';
import { useWish } from '../hooks/useWishe';
import { useSetting } from '../hooks/useWebsiteSettings';
import { Skeleton } from '../components/Skeleton';
import { handleClick } from '../utils/helper';

const ProductCard = ({
    title,
    description,
    thumbnail,
    price,
    productId,
    itemCode,
    isGift,
    salesPrice,
    discount,
}) => {
    const { Wish,addToWish, removeFromWish, setIsOpen:setWishOpen } = useWish()
    const { cart, addToCart, loading, setIsOpen } = useCart()
    const {hideCheckout, buttonLabel, buttonLink, hideWish} = useSetting();
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate()

    const handleWish = (e) => {
        e.preventDefault();
        if (Wish[itemCode]) {
            removeFromWish(itemCode)
        } else {
            addToWish(itemCode)
            setWishOpen(true)
        }
    }

    return (
        <div className="w-full h-full product_card">
            <div className="relative">
                <Link to={`/products/${productId}`} onClick={() => window.scrollTo(0,0)}>

                {loaded ? null : (
                        <div className='grid gap-[14px] grid-cols-1 lg:grid-cols-1 place-items-center w-full h-full'>
                        <Skeleton className='h-full w-full aspect-square'/>
                    </div>
                )}
                <img
                    style={loaded ? {} : { display: 'none' }}
                    src={thumbnail}
                    alt={title}
                    className="object-cover h-auto aspect-square w-full fade-in"
                    onLoad={() => setLoaded(true)}
                />
                    {discount && (
                        <div className="absolute inline-flex items-center justify-center text-sm font-medium text-white bg-destructive py-1 px-2 top-2 left-2 rounded-md">
                            {discount}
                        </div>
                    )}
                </Link>

     
                    <div className='p-2 w-full absolute bottom-0 add_to_cart'>
                        <SfButton disabled={loading} className={`btn-secondary w-full h-10 py-3 font-semibold shadow-custom !text-base ${loading ? '!bg-neutral-50' : ''}`} type="button" size="sm" onClick={(e) => {
                            e.preventDefault();
                            if (hideCheckout != 1)
                            {
                                addToCart(itemCode, cart[itemCode] ? cart[itemCode] + 1 : 1);
                                setIsOpen(true)
                            } else {
                                handleClick(buttonLink, navigate)
                            }

                        }}>
                        {loading ? <SfLoaderCircular/> : buttonLabel}
                        </SfButton>
                    </div>

            </div>
            <div className="py-6 flex flex-col justify-between">
                <div className='flex flex-col gap-y-4'>
                    <SfLink href="#" className="text-texttag text-base leading-[9px] no-underline font-medium relative">
                        <p className='product-title text-maingray'>{title}</p>
                        {isGift && <span className="text-primary">- Gift</span>}
                        {/* {!hideWish && <SfButton
                            onClick={handleWish} 
                            type="button"
                            variant="tertiary"
                            size="sm"
                            square
                            className="absolute top-0 right-0 bg-white z-50 !px-2"
                            aria-label="Add to wishlist"
                        >
                            {Wish[itemCode] == 1 ? (
                                <SfIconFavoriteFilled size="sm"/>
                            ) : (
                                <SfIconFavorite size="sm" />
                            )}
                        </SfButton>
                        } */}
                    </SfLink>
                    {/* <p className="product-desc text-maingray text-base">
                        {description}
                    </p> */}
                    <span className='flex flex-row items-center justify-start gap-2'>
                        <strong className={`block ${salesPrice ? 'text-destructive text-sm lg:text-base' : 'text-maingray product-price'}`}>{price}</strong>
                        {salesPrice && <span className="block text-sm text-maingray line-through">{salesPrice}</span>}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard

ProductCard.propTypes = {
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    productId: PropTypes.string.isRequired,
    salesPrice: PropTypes.number,
    discount: PropTypes.string,
};
