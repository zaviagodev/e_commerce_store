import {
    SfLoaderCircular,
    SfScrollable,
} from '@storefront-ui/react';
import { useCounter } from 'react-use';
import { clamp } from '@storefront-ui/shared';
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
} from '@storefront-ui/react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useSetting } from '../hooks/useWebsiteSettings';
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const { id } = useParams();
    const { get } = useProducts();
    const {hideCheckout, buttonLabel, buttonLink} = useSetting();
    const { cart, addToCart, loading } = useCart();
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
        if(hideCheckout){
            if(!buttonLink.startsWith('/')) window.location.href = `https://${buttonLink}`
            else navigate(buttonLink);
            return
        }
        addToCart(product?.item_code, cart[product?.item_code] ? cart[product?.item_code] + value : value)
        
    }


    return (
        <main className="main-section flex">
            <div className="relative flex w-full aspect-[4/3] w-1/2">
                <SfScrollable
                    className="relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    direction="vertical"
                    buttonsPlacement="none"
                    drag={{ containerWidth: true }}
                >
                    <div className="absolute inline-flex items-center justify-center text-sm font-medium text-muted bg-destructive py-1.5 px-3 mb-4">
                        <SfIconSell size="sm" className="mr-1.5" />
                        {product?.discount}
                    </div>
                    <img
                        src={`${import.meta.env.VITE_ERP_URL}${product?.website_image}`}
                        className="object-contain w-auto h-full"
                        aria-label={product?.website_image}
                        alt={product?.website_image}
                    />
                </SfScrollable>
            </div>
            <section className="mt-4 md:mt-6 w-1/2">
                <h1 className="mb-1 font-bold typography-headline-4 text-texttag">
                    {product?.item_name}
                </h1>
                <div dangerouslySetInnerHTML={{ __html: product?.short_description }} />
                <span className='flex flex-row items-center justify-start gap-2 mb-4'>
                    {product?.formatted_mrp && <strong className="block font-bold typography-headline-3 line-through">{product?.formatted_mrp}</strong>}
                    <strong className={`block font-bold typography-headline-3 text-lg ${product?.formatted_mrp ? 'text-destructive' : 'text-primary'}`}>{product?.formatted_price}</strong>
                </span>
                <div className="py-4 mb-4 border-gray-200 border-y">
                    { 
                        cart[product?.item_code] && !hideCheckout  && (
                            <div className="bg-primary-100 text-primary-700 flex justify-center gap-1.5 py-1.5 typography-text-sm items-center mb-4 rounded-md">
                                <SfIconShoppingCartCheckout />{cart[product?.item_code]} in cart
                            </div>
                        )
                    }
                    <div className="items-start xs:flex">
                        {!hideCheckout && <div className="flex flex-col items-stretch xs:items-center xs:inline-flex">
                            <div className="flex border border-neutral-300 rounded-md">
                                <SfButton
                                    type="button"
                                    variant="tertiary"
                                    square
                                    className="rounded-r-none p-3"
                                    disabled={value <= min}
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
                                    className="grow appearance-none mx-2 w-8 text-center bg-transparent font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
                                    min={min}
                                    max={max}
                                    value={value}
                                    onChange={handleOnChange}
                                />
                                <SfButton
                                    type="button"
                                    variant="tertiary"
                                    square
                                    className="rounded-l-none p-3"
                                    disabled={value >= max}
                                    aria-controls={inputId}
                                    aria-label="Increase value"
                                    onClick={() => inc()}
                                >
                                    <SfIconAdd />
                                </SfButton>
                            </div>
                            <p className="self-center mt-1 mb-4 text-xs text-neutral-500 xs:mb-0">
                                <strong className="text-neutral-900">{product?.in_stock ? "✔ In Stock" : "❌ sold out"}</strong>
                            </p>
                        </div>}
                        <SfButton disabled={loading}  onClick={handleClickCart} type="button" size="lg" className="w-full xs:ml-4 text-btn-primary-foreground bg-btn-primary" slotPrefix={!hideCheckout && <SfIconShoppingCart size="sm" />}>
                            {loading ? <SfLoaderCircular/> : buttonLabel}
                        </SfButton>
                    </div>
                </div>
                <div className='mb-4 whitespace-normal' dangerouslySetInnerHTML={{ __html: product?.web_long_description }} />
                <div className="flex first:mt-4">
                    <SfIconPackage size="sm" className="flex-shrink-0 mr-1 text-neutral-500" />
                    <p className="text-sm">
                        Free shipping, arrives by Thu, Apr 7. Want it faster?
                        <SfLink href="#" variant="secondary" className="mx-1 text-secondary no-underline">
                            Add an address
                        </SfLink>
                        to see options
                    </p>
                </div>
                <div className="flex mt-4">
                    <SfIconWarehouse size="sm" className="flex-shrink-0 mr-1 text-neutral-500" />
                    <p className="text-sm">
                        Pickup not available at your shop.
                        <SfLink href="#" variant="secondary" className="ml-1 text-secondary no-underline">
                            Check availability nearby
                        </SfLink>
                    </p>
                </div>
                <div className="flex mt-4">
                    <SfIconSafetyCheck size="sm" className="flex-shrink-0 mr-1 text-neutral-500" />
                    <p className="text-sm">
                        Free 30-days returns.
                        <SfLink href="#" variant="secondary" className="ml-1 text-secondary no-underline">
                            Details
                        </SfLink>
                    </p>
                </div>
            </section>
        </main >
    )
}

export default Product


