import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useFrappeAuth } from 'frappe-react-sdk';
import { SfLoaderCircular } from '@storefront-ui/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { SfIconArrowBack, SfIconExpandMore, SfListItem } from '@storefront-ui/react';

const Home = () => {
    const { updateCurrentUser } = useFrappeAuth();
    const { products, mainGroup } = useProducts()
    const [group, setGroup] = useState(false);
    const navigate = useNavigate();



    const rawIdFromUrl = useParams().itemsgroup;
    const idFromUrl = rawIdFromUrl.startsWith('group_') ? rawIdFromUrl.replace('group_', '') : rawIdFromUrl;
    
    useEffect(() => {
        if (rawIdFromUrl.startsWith('group_') && mainGroup.length > 0) {
            const group = findGroup(mainGroup, rawIdFromUrl.replace('group_', ''));
            if (group) {
                setGroup(group);
            }
        }
        return () => {
            setGroup(false);
        };
    }, [rawIdFromUrl, mainGroup]);

    // Helper function for recursive search
    const findGroup = (groups, groupName) => {
        for (const group of groups) {
            if (group.name === groupName) {
                return group;
            }
    
            if (group.children) {
                const result = findGroup(group.children, groupName);
                if (result) {
                    return result;
                }
            }
        }
    
        return null;
    };

    const findParentName = (groups, groupName, parent = null) => {
        for (const group of groups) {
            if (group.name === groupName) {
                return parent ? parent.name : null;
            }
    
            if (group.children) {
                const result = findParentName(group.children, groupName, group);
                if (result) {
                    return result;
                }
            }
        }
    
        return null;
    };



    useEffect(() => {
        updateCurrentUser();
    }, [updateCurrentUser]);

    return (
        <>
            <main className='main-section'>
              <h1 className="mb-8 primary-heading text-primary text-center">{idFromUrl.toUpperCase()}</h1>
                    <button onClick={() => navigate(-1)} className='flex flex-row items-center justify-between p-2'><SfIconArrowBack/>  { group ? findParentName(mainGroup, group.name) : 'Back'} </button>
                    {group && 
                        group.children.map((item) => (
                            <Link to={`/home/${item.children.length > 0 ? 'group_' : ''}${item.name}`} className='flex flex-1 felx-col items-center justify-between'  >
                                <li key={item.name} className='flex-1'>
                                <SfListItem
                                    as="a"
                                    size="sm"
                                    role="none"
                                    href={`#${item.name}`}
                                    className="typography-text-base md:typography-text-sm py-4 md:py-1.5 "
                                >
                                    {item.name}
                                </SfListItem>
                                </li> 
                                {item.children.length > 0 && <SfIconExpandMore className=" inline-flex m-2 -rotate-90" />}
                            </Link> 
                        ))
                    }
                    {products.length > 0  ? (
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
                        <div className='flex justify-center'>
                            <SfLoaderCircular/>
                        </div>
                    )}
            </main>
        </>
    )
}

export default Home