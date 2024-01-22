import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useFrappeAuth } from 'frappe-react-sdk';
import { SfButton, SfIconTune, SfLoaderCircular, SfSelect } from '@storefront-ui/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Skeleton } from '../components/Skeleton';
import { Icons } from '../components/icons'


const Home = () => {
    const { updateCurrentUser } = useFrappeAuth();
    const { products, mainGroup,settingPage } = useProducts()
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
            title:'ราคาสูงไปต่ำ',
            state:false,
            onChange:(a,b) => b.price_list_rate - a.price_list_rate
        },
        {
            title:'ราคาต่ำไปสูง',
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
                {products.length > 0 ? (
                    <h1 className="mb-[53px] text-primary text-center text-xl font-medium">{idFromUrl}</h1>
                ): (
                    <Skeleton className='h-10 w-[200px] mx-auto mb-[53px]'/>
                )}
                    {products.length > 0 ? (
                        <div>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='font-medium text-base'>สินค้าทั้งหมด <span className='font-normal text-maingray inline-block ml-1'> ({products.length} ไอเทม)</span></h3>
                                <div className='flex items-center gap-x-[22px]'>
                                    <h3 className='font-medium flex items-center gap-x-[9px] text-base'>
                                        <Icons.filterLines className='w-[22px] h-[22px]'/>
                                        เรียงตาม
                                    </h3>
                                    <SfSelect size='sm' className='!ring-0 !border-0 !text-right !pr-12 !bg-[#F3F3F3] !text-[#7A7A7A] !rounded-[9px] leading-6 text-base font-bold' onChange={handleSortOptions} value={sortOptions.find(option => option.state)?.title}>
                                        {sortOptions.map((option, index) => (
                                            <option value={option.title} key={index} className={`text-left ${option.state ? 'font-bold' : 'font-normal'}`} selected={option.state ? true : false}>{option.title}</option>
                                        ))}
                                    </SfSelect>
                                </div>
                            </div>
                            <div
                                className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center"
                                >
                                    {products.filter((product) => idFromUrl === 'all items' || idFromUrl === product.item_group).sort(sortOptions.find(option => option.state === true).onChange).map((product) => (
                                        <ProductCard
                                            key={product.item_code}
                                            title={product.web_item_name}
                                            productId={product.name}
                                            description={product.short_description}
                                            itemCode={product.item_code}
                                            price={product.formatted_price}
                                            thumbnail={product.website_image ? `${import.meta.env.VITE_ERP_URL || ""}${product.website_image}` : `${import.meta.env.VITE_ERP_URL || ""}${settingPage.default_product_image}`}
                                            salesPrice={product?.formatted_mrp}
                                            isGift={product?.item_group === "Gift" || product?.item_group === "Gift and Cards"}
                                        />
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-y-2'>
                            <div className='flex justify-between mb-4'>
                                <Skeleton className='h-9 w-[100px]'/>
                                <Skeleton className='h-9 w-[100px]'/>
                            </div>
                            <div className='grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4 place-items-center w-full h-full'>
                                <Skeleton className='h-full w-full aspect-square'/>
                                <Skeleton className='h-full w-full aspect-square'/>
                                <Skeleton className='h-full w-full aspect-square'/>
                                <Skeleton className='h-full w-full aspect-square'/>
                            </div>
                        </div>
                    )}
            </main>
        </>
    )
}

export default Home