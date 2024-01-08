import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { SfButton, SfRating, SfCounter, SfLink, SfIconShoppingCart, SfIconFavorite, SfLoaderCircular } from '@storefront-ui/react';
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
    const { Wish,addToWish, removeFromWish } = useWish()
    const { cart, addToCart, loading } = useCart()
    const { hideWish} = useSetting()

    const handleWish = (e) => {
        e.preventDefault();
        if (Wish[itemCode]) {
            removeFromWish(itemCode)
        } else {
            addToWish(itemCode)
        }
    }
    return (
        
            <div className="border border-neutral-200 rounded-md hover:shadow-lg w-full h-full">
                <div className="relative">
                    <Link to={`/products/${productId}`}>
                        <img
                            src={thumbnail}
                            alt={title}
                            className="object-cover h-auto rounded-md aspect-square w-full"
                        />
                    </Link>
                    {!hideWish && <SfButton
                        onClick={handleWish} 
                        type="button"
                        variant="tertiary"
                        size="sm"
                        square
                        className="absolute bottom-2 right-2  bg-white ring-1 ring-inset ring-neutral-200 !rounded-full z-50"
                        aria-label="Add to wishlist"
                    >
                         <SfIconFavorite className={`${Wish[itemCode] == 1 && 'text-primary'}`}  size="sm" />
                    </SfButton>}
                </div>
                <div className="p-4 border-t border-neutral-200 flex flex-col justify-between">
                    <div className='flex flex-col mb-2'>
                        <SfLink href="#" className="text-texttag text-sm no-underline">
                            {title} {isGift && <span className="text-primary">- Gift</span>}
                        </SfLink>
                        <p className="text-black text-sm">
                            {description}
                        </p>
                        <span className='flex flex-row pb-2 items-center justify-start gap-2'>
                            {salesPrice && <strong className="block text-sm text-primary line-through">{salesPrice}</strong>}
                            <strong className={`block text-lg ${salesPrice ? 'text-destructive' : 'text-primary'}`}>{price}</strong>
                        </span>
                    </div>
                    
                    {/*<SfButton disabled={loading} className='bg-btn-primary text-btn-primary-foreground' type="button" size="sm" slotPrefix={<SfIconShoppingCart size="sm" />} onClick={(e) => {
                        e.preventDefault();
                        addToCart(itemCode, cart[itemCode] ? cart[itemCode] + 1 : 1)
                    }}>
                       {loading ? <SfLoaderCircular/> : 'Add to cart'}
                    </SfButton> */}
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
