import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { SfButton, SfRating, SfCounter, SfLink, SfIconShoppingCart, SfIconFavorite, SfLoaderCircular } from '@storefront-ui/react';
import { useCart } from '../hooks/useCart';
import { useWish } from '../hooks/useWishe';

const ProductCard = ({
    title,
    description,
    thumbnail,
    price,
    productId,
    itemCode,
    isGift
}) => {
    const { Wish,addToWish, removeFromWish } = useWish()
    const { cart, addToCart, loading } = useCart()

    const handleWish = (e) => {
        e.preventDefault();
        if (Wish[itemCode]) {
            removeFromWish(itemCode)
        } else {
            addToWish(itemCode)
        }
    }
    return (
        
            <div className="border border-neutral-200 rounded-md hover:shadow-lg max-w-[300px]">
                <div className="relative">
                    <Link to={`/products/${productId}`}>
                        <img
                            src={thumbnail}
                            alt={title}
                            className="object-cover h-auto rounded-md aspect-square"
                            width="300"
                            height="300"
                        />
                    </Link>
                    <SfButton
                        onClick={handleWish} 
                        type="button"
                        variant="tertiary"
                        size="sm"
                        square
                        className="absolute bottom-2 right-2  bg-white ring-1 ring-inset ring-neutral-200 !rounded-full z-50"
                        aria-label="Add to wishlist"
                    >
                        <SfIconFavorite className={`${Wish[itemCode] == 1 && 'text-primary-600'}`}  size="sm" />
                    </SfButton>
                </div>
                <div className="p-4 border-t border-neutral-200">
                    <SfLink href="#" variant="secondary" className="no-underline">
                        {title} {isGift && <span className="text-primary-600">- Gift</span>}
                    </SfLink>
                    <div className="flex items-center pt-1">
                        <SfRating size="xs" value={5} max={5} />

                        <SfLink href="#" variant="secondary" className="pl-1 no-underline">
                            <SfCounter size="xs">{123}</SfCounter>
                        </SfLink>
                    </div>
                    <p className="block py-2 font-normal typography-text-sm text-neutral-700">
                        {description}
                    </p>
                    <span className="block pb-2 font-bold typography-text-lg">{price}</span>
                    {/*<SfButton disabled={loading} type="button" size="sm" slotPrefix={<SfIconShoppingCart size="sm" />} onClick={(e) => {
                        e.preventDefault();
                        addToCart(itemCode, cart[itemCode] ? cart[itemCode] + 1 : 1)
                    }}>
                       {loading ? <SfLoaderCircular/> : 'Add to cart'}
                    </SfButton>*/}
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
    productId: PropTypes.string.isRequired
};
