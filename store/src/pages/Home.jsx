import React, { useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useFrappeAuth } from 'frappe-react-sdk';

const Home = () => {
    const { updateCurrentUser } = useFrappeAuth();
    const { products } = useProducts()

    useEffect(() => {
        updateCurrentUser()
    }, [updateCurrentUser])

    return (
        <>
            <header>
                <h1 className="my-4">All Products</h1>
            </header>
            <main>
                <div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto"

                >
                    {(products ?? []).map((product) => (
                        <ProductCard
                            key={product.item_code}
                            title={product.name}
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