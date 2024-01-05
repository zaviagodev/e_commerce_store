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

const Product = () => {
    const { id } = useParams();
    const { get, products } = useProducts();
    const { cart, addToCart, loading } = useCart();
    
    const product = get(id);
    const inputId = "useId('input')";
    const min = 1;
    const max = 999;
    const [value, { inc, dec, set }] = useCounter(min);

    function handleOnChange(event) {
        const { value: currentValue } = event.target;
        const nextValue = parseFloat(currentValue);
        set(Number(clamp(nextValue, min, max)));
    }

    return (
        <main className="main-section grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
            <div className="relative flex w-full">
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
                        src={`${import.meta.env.VITE_ERP_URL}${product?.website_image}`}
                        className="object-contain w-auto h-full"
                        aria-label={product?.website_image}
                        alt={product?.website_image}
                    />
                </SfScrollable>
            </div>
            <section className="mt-4 md:mt-6">
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
                        cart[product?.item_code] && (
                            <div className="bg-primary-100 text-primary-700 flex justify-center gap-1.5 py-1.5 typography-text-sm items-center mb-4 rounded-md">
                                <SfIconShoppingCartCheckout />Added {cart[product?.item_code]} {cart[product?.item_code] === 1 ? 'item' : 'items'} to cart.
                            </div>
                        )
                    }
                    <div className="items-start xs:flex">
                        <div className="flex flex-col items-stretch xs:items-center xs:inline-flex">
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
                                    className="grow appearance-none mx-2 w-8 text-center bg-transparent font-medium outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
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
                            <p className="self-center mt-1 mb-4 text-xs text-neutral-500 xs:mb-0">
                                <strong className="text-neutral-900">{product?.in_stock ? "✔ In Stock" : "❌ sold out"}</strong>
                            </p>
                        </div>
                        <SfButton disabled={loading || !product?.in_stock}  onClick={() => addToCart(product?.item_code, cart[product?.item_code] ? cart[product?.item_code] + value : value)} type="button" size="lg" className="w-full xs:ml-4 btn-primary" slotPrefix={<SfIconShoppingCart size="sm" />}>
                            {loading ? <SfLoaderCircular/> : product?.in_stock ? 'Add to cart' : 'Sold out'}
                        </SfButton>
                    </div>
                </div>
                <div className='mb-4 whitespace-normal overflow-hidden' dangerouslySetInnerHTML={{ __html: product?.web_long_description }} />
            </section>
        </main>
    )
}

export default Product


