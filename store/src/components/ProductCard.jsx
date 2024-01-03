import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { SfButton, SfRating, SfCounter, SfLink, SfIconShoppingCart, SfIconFavorite } from '@storefront-ui/react';
import { useCart } from '../hooks/useCart';

const ProductCard = ({
    title,
    thumbnail,
    price,
    productId,
    itemCode,
    isGift
}) => {
    const { cart, addToCart } = useCart()
    return (
        <Link to={`/products/${productId}`}>
            <div className="border border-neutral-200 rounded-md hover:shadow-lg">
                <div className="relative">
                    <SfLink href="#" className="block">
                        {thumbnail ? (
                            <img
                            src={thumbnail}
                            alt={title}
                            className="object-cover h-auto rounded-md aspect-square w-full"
                        />
                        ) : (<div className='bg-gray-100 w-full h-full rounded-md'/>)}
                    </SfLink>
                    <SfButton
                        type="button"
                        variant="tertiary"
                        size="sm"
                        square
                        className="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full"
                        aria-label="Add to wishlist"
                    >
                        <SfIconFavorite size="sm" />
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
                        Lightweight • Non slip • Flexible outsole • Easy to wear on and off
                    </p>
                    <span className="block pb-2 font-bold typography-text-lg">{price}</span>
                    <SfButton type="button" size="sm" slotPrefix={<SfIconShoppingCart size="sm" />} onClick={(e) => {
                        e.preventDefault();
                        addToCart(itemCode, cart[itemCode] ? cart[itemCode] + 1 : 1)
                    }}>
                        Add to cart
                    </SfButton>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard

ProductCard.propTypes = {
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    productId: PropTypes.string.isRequired
};
