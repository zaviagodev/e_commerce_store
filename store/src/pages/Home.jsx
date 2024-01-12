import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useFrappeAuth } from 'frappe-react-sdk';
import { SfButton, SfIconTune, SfLoaderCircular, SfSelect } from '@storefront-ui/react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Home = () => {
    const { updateCurrentUser } = useFrappeAuth();
    const { products, mainGroup } = useProducts()
    const navigate = useNavigate();

    const idFromUrl = useParams().itemsgroup;

    useEffect(() => {
        updateCurrentUser();
    }, [updateCurrentUser]);

    const [sortOptions, setSortOptions] = useState([
        {
            title:'Default',
            state:true,
            onChange:undefined
        },
        {
            title:'Price: High to Low',
            state:false,
            onChange:(a,b) => b.price_list_rate - a.price_list_rate
        },
        {
            title:'Price: Low to High',
            state:false,
            onChange:(a,b) => a.price_list_rate - b.price_list_rate
        },
    ])

    const handleSortOptions = (e) => {
        const selectedIndex = e.target.selectedIndex;
        setSortOptions((prevOptions) => {
          const updatedOptions = [...prevOptions];
          updatedOptions.forEach((option, index) => {
            option.state = index === selectedIndex;
          });
          return updatedOptions;
        });
      };

    return (
        <>
            <main className='main-section'>
              <h1 className="mb-8 text-primary text-center text-[34px] font-bold">{idFromUrl.toUpperCase()}</h1>
                    {products.length > 0 ? (
                        <div>
                            <div className='flex items-center justify-between border-b mb-5'>
                                <h3 className='font-medium text-base'>All products <span className='font-normal text-sm text-[#A1A1A1]'>({products.length} {products.length === 1 ? 'product': 'products'})</span></h3>
                                <div className='flex items-center'>
                                    <h3 className='font-medium text-sm flex items-center gap-x-1'>
                                        <SfIconTune size='xs' />
                                        SORT:
                                    </h3>
                                    <SfSelect className='text-sm !ring-0 !border-0 !text-right !pr-12 !pl-2' onChange={handleSortOptions} value={sortOptions.find(option => option.state)?.title}>
                                        {sortOptions.map((option, index) => (
                                            <option value={option.title} key={index} className={`text-left ${option.state ? 'font-bold' : 'font-normal'}`} selected={option.state ? true : false}>{option.title}</option>
                                        ))}
                                    </SfSelect>
                                </div>
                            </div>
                            <div
                                className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center"
                                >
                                    {products.filter((product) => idFromUrl === 'all items' || idFromUrl === product.item_group).sort(sortOptions.find(option => option.state === true).onChange).map((product) => (
                                        <ProductCard
                                            key={product.item_code}
                                            title={product.web_item_name}
                                            productId={product.name}
                                            description={product.short_description}
                                            itemCode={product.item_code}
                                            price={product.formatted_price}
                                            thumbnail={`${import.meta.env.VITE_ERP_URL ?? ''}${product.website_image}`}
                                            salesPrice={product?.formatted_mrp}
                                            isGift={product?.item_group === "Gift" || product?.item_group === "Gift and Cards"}
                                        />
                                    ))}
                            </div>
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