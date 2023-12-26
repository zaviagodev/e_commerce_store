import React, { useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useFrappeAuth } from 'frappe-react-sdk';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const { updateCurrentUser } = useFrappeAuth();
    const { products } = useProducts()

    const location = useLocation();
    var idFromUrl = decodeURIComponent(location.hash.substring(1)); // remove the '#' at the start, decode URI components and replace special characters location.hash.toUpperCase().replace(/[^a-zA-Z0-9]/g, ''); // remove the '#' at the start and replace special characters

    useEffect(() => {
        updateCurrentUser();
    }, [updateCurrentUser]);

    return (
        <>
            <header >
                <h1 className="my-4 px-2">{idFromUrl.toUpperCase() === '' ? 'ALL ITEMS' : idFromUrl.toUpperCase()}</h1>
            </header>
            <main>
                    <div
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-items-center"

                        >
                            {(products ?? []).filter((product) => idFromUrl === '' || idFromUrl === product.item_group).map((product) => (
                                <ProductCard
                                    key={product.item_code}
                                    title={product.web_item_name}
                                    productId={product.name}
                                    itemCode={product.item_code}
                                    price={product.formatted_price}
                                    thumbnail={product.website_image ? product.website_image : "https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/sneakers.png"}
                                    isGift={product?.item_group === "Gift" || product?.item_group === "Gift and Cards"}
                                />
                            ))}
                    </div>
            </main>
        </>
    )
}

export default Home