import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { SfButton, SfRating, SfCounter, SfLink, SfIconShoppingCart, SfIconFavorite, SfLoaderCircular, SfIconSell, SfIconFavoriteFilled } from '@storefront-ui/react';
import { useCart } from '../hooks/useCart';
import { useWish } from '../hooks/useWishe';
import { useSetting } from '../hooks/useWebsiteSettings';

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
    const { hideWish} = useSetting()

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
                    <Link to={`/products/${productId}`}>
                        <img
                            src={thumbnail}
                            alt={title}
                            className="object-cover h-auto aspect-[3/4] w-full"
                        />
                        {discount && (
                            <div className="absolute inline-flex items-center justify-center text-sm font-medium text-white bg-destructive py-1 px-2 top-2 left-2 rounded-md">
                                {discount}
                            </div>
                        )}
                    </Link>
                    <div className='p-2 w-full absolute bottom-0 add_to_cart'>
                        <SfButton disabled={loading} className='btn-primary w-full py-3' type="button" size="sm" onClick={(e) => {
                            e.preventDefault();
                            addToCart(itemCode, cart[itemCode] ? cart[itemCode] + 1 : 1);
                            setIsOpen(true)
                        }}>
                        {loading ? <SfLoaderCircular/> : 'Add to cart'}
                        </SfButton>
                    </div>
                </div>
                <div className="py-2 flex flex-col justify-between">
                    <div className='flex flex-col'>
                        <SfLink href="#" className="text-texttag text-sm no-underline font-medium relative">
                            <p className='overflow-hidden text-ellipsis pr-3'>{title}</p>
                            {isGift && <span className="text-primary">- Gift</span>}
                            {!hideWish && <SfButton
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
                            }
                        </SfLink>
                        <p className="text-black text-sm font-medium overflow-hidden text-ellipsis pr-3">
                            {description}
                        </p>
                        <span className='flex flex-row items-center justify-start gap-2 font-medium pt-2'>
                            <strong className={`block text-sm ${salesPrice ? 'text-destructive' : 'text-primary'}`}>{price}</strong>
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
