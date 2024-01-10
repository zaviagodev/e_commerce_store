import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useFrappeAuth } from 'frappe-react-sdk';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { SfLoaderCircular } from '@storefront-ui/react';

const Home = () => {
    const { updateCurrentUser } = useFrappeAuth();
    const { products, mainGroup } = useProducts()
    const navigate = useNavigate();



    const idFromUrl = useParams().itemsgroup;
    






    useEffect(() => {
        updateCurrentUser();
    }, [updateCurrentUser]);

    return (
        <>
            <main className='main-section'>
              <h1 className="mb-8 primary-heading text-primary text-center">{idFromUrl.toUpperCase()}</h1>
                    {products.length > 0 ? (
                        <div
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center"
                         >
                             {products.filter((product) => idFromUrl === 'all items' || idFromUrl === product.item_group).map((product) => (
                                 <ProductCard
                                     key={product.item_code}
                                     title={product.web_item_name}
                                     productId={product.name}
                                     description={product.short_description}
                                     itemCode={product.item_code}
                                     price={product.formatted_price}
                                     thumbnail={product.website_image ? `${import.meta.env.VITE_ERP_URL}${product.website_image}` : null}
                                     salesPrice={product?.formatted_mrp}
                                     isGift={product?.item_group === "Gift" || product?.item_group === "Gift and Cards"}
                                 />
                             ))}
                     </div>
                    ) : (
                        <div className='grid place-items-center w-full h-full'>
                            <SfLoaderCircular />
                        </div>
                    )}
            </main>
        </>
    )
}

export default Home