import {
  SfIconShoppingCart,
  SfIconFavorite,
  SfIconPerson,
  SfIconExpandMore,
  SfIconClose,
  SfButton,
  SfDrawer,
  SfListItem,
  useDisclosure,
  useTrapFocus,
  SfInput,
  SfBadge,
  SfIconSearch,
  SfIconMenu,
} from '@storefront-ui/react';
import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '../hooks/useUser';
import { useWish } from '../hooks/useWishe';
import { useSetting } from '../hooks/useWebsiteSettings';

import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { CSSTransition } from 'react-transition-group';
import { useProducts } from '../hooks/useProducts';

import SearchWithIcon from './SearchBar';

import SelectDropdownPreselected from './dropDown';
export default function BaseMegaMenu() {
  const { close, toggle, isOpen } = useDisclosure();
  const drawerRef = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const { cartCount, setIsOpen } = useCart();
  const { WishCount,setIsOpen : setWishOpen } = useWish();
  const { user } = useUser();

  const product = useProducts()
  const groupes = product.getProductGroups()

  const {appName, appLogo,hideLogin, hideCheckout, navbarSearch, topBarItems, hideWish, isLoading} = useSetting()

 const  handlLoginClick = () => {
    if (user && user.name !== 'Guest') 
      {
        navigate('/profile');
      } 
    else 
      {
        navigate('/login');
      }
  }


  const [actionItems, setActionItems] = useState([
      {
          icon: <></>,
          label: '',
          ariaLabel: 'Log in',
          role: 'login',
          show: false,
          onClick: null
      },
      {
          icon: <SfIconShoppingCart />,
          label: '',
          ariaLabel: 'Cart',
          role: 'button',
          show: false,
          onClick: () => setIsOpen(true)
      },
      {
          icon: <SfIconFavorite />,
          label: '',
          ariaLabel: 'Wishlist',
          role: 'button',
          show: false,
          onClick: () => setWishOpen(true),
      },
  ]);

  useEffect(() => {
    if(isLoading) return;
    setActionItems(prev => prev.map((item, index) => {
      
        if ((index === 2 && !hideWish) || (index === 1 && !hideCheckout)) {
            return { ...item, show: true };
        }
        if (index === 0 && !hideLogin  ) {
          console.log('user', user)
            return { ...item, show: true };
        }
        return item;
    }));
}, [hideWish, hideCheckout, hideLogin, isLoading, user]);

  useTrapFocus(drawerRef, {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: 'container',
  });
  useClickAway(menuRef, () => {
    close();
  });

  function handleClick(url) {
    
    if(!url.startsWith('/')){  
      window.location.assign('https://' + url)
    }
    else  {
      navigate(`https://${url}`)
    };
  }

  const productList = (name) => 
      <>
      <SfButton
        className="hidden lg:flex text-white bg-transparent font-body hover:bg-primary hover:text-white active:bg-primary active:text-white"
        aria-haspopup="true"
        aria-expanded={isOpen}
        slotSuffix={<SfIconExpandMore className="hidden lg:inline-flex" />}
        variant="tertiary"
        onClick={toggle}
        square
      >
      <span className="hidden lg:inline-flex whitespace-nowrap">{name}</span>
      </SfButton>
      <nav className='absolute top-0 right-0 w-full'>
        <ul>
            <li role="none">
                <CSSTransition
                  in={isOpen}
                  timeout={500}
                  unmountOnExit
                  classNames={{
                    enter: '-translate-x-full lg:opacity-0 lg:translate-x-0',
                    enterActive: 'translate-x-0 lg:opacity-100 transition duration-500 ease-in-out',
                    exitActive: '-translate-x-full lg:opacity-0 lg:translate-x-0 transition duration-500 ease-in-out',
                  }}
                >
                  <SfDrawer
                    ref={drawerRef}
                    open
                    disableClickAway
                    placement="top"
                    className="grid grid-cols-1 lg:gap-x-6 lg:grid-cols-4 bg-white shadow-lg p-0 max-h-screen overflow-y-auto lg:!absolute lg:!top-20 max-w-[376px] lg:max-w-full lg:p-6 mr-[50px] lg:mr-0 z-99"
                  >
                    <div className="sticky top-0 flex items-center justify-between px-4 py-2 bg-primary lg:hidden">
                      <div className="flex items-center font-medium text-white typography-text-lg">{name}</div>
                      <SfButton
                        square
                        variant="tertiary"
                        aria-label="Close navigation menu"
                        onClick={close}
                        className="text-white ml-2"
                      >
                        <SfIconClose />
                      </SfButton>
                    </div>
                    {groupes.map((item) => recursiveBuildPhone(item))}
                    <SfButton
                      square
                      size="sm"
                      variant="tertiary"
                      aria-label="Close navigation menu"
                      onClick={close}
                      className="hidden md:block md:absolute md:right-0 hover:bg-white active:bg-white"
                    >
                      <SfIconClose className="text-neutral-500" />
                    </SfButton>
                  </SfDrawer>
                </CSSTransition>
              </li>
        </ul>
      </nav>
      </>
  function recursiveBuildPhone (itemTop){

    const recurse = (item) => {
      return(
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
      )
    }

    return(
    <div key={itemTop.name} className="[&:nth-child(2)]:pt-0 pt-6 md:pt-0">
      <h2
        role="presentation"
        className="typography-text-base font-medium text-neutral-900 whitespace-nowrap p-4 md:py-1.5"
      >
                  {itemTop.name}
      </h2>
      <hr className="mb-3.5" />
      <ul>
        {
          itemTop.children.length > 0 ? itemTop.children.map((child) => {
            return(
               recurse(child)
            )
          })
          :
          <Link to={`/home/${itemTop.name}`}   >
          <li key={itemTop.name}>
            <SfListItem
              as="a"
              size="sm"
              role="none"
              href={`#${itemTop.name}`}
              className="typography-text-base md:typography-text-sm py-4 md:py-1.5"
            >
              {itemTop.name}
            </SfListItem>
          </li>
        </Link> 
        }
      </ul> 
    </div>
    )

  }


  function recursiveBuild (item){
    const button = 
      <li> 
        <SfButton
          key={item.label}
          className="hidden md:flex text-white bg-transparent font-body hover:bg-primary hover:text-white active:bg-primary active:text-white"
          aria-label={item.label}
          variant="tertiary"
          square
          onClick={() => handleClick(item.url)}
        >{item.label}</SfButton>
      </li>
    if(item.children.length === 0) return button
    if(item.children.length > 0) return  <SelectDropdownPreselected dropdowndame={item.label}  options={item.children} />
  } 

  return (
    <div className="w-full h-full">
      {isOpen && <div className="fixed inset-0 bg-neutral-500 bg-opacity-50 transition-opacity z-60" />}
      <header
        ref={menuRef}
        className="flex flex-wrap lg:flex-nowrap justify-center w-full py-2 lg:py-5 border-0 bg-primary border-neutral-200 lg:relative lg:z-99"
      >
        <div className="flex items-center justify-start h-full max-w-[1536px] w-full px-4 lg:px-10">
          <SfButton
            className="block lg:hidden text-white bg-transparent font-body hover:bg-primary hover:text-white active:bg-primary active:text-white"
            aria-haspopup="true"
            aria-expanded={isOpen}
            variant="tertiary"
            onHover={toggle}
            onClick={toggle}
            square
          >
            <SfIconMenu className=" text-white" />
          </SfButton>
          <Link to="home/all items" className="flex mr-4 focus-visible:outline text-white focus-visible:outline-offset focus-visible:rounded-sm shrink-0">
                  <picture>
                      <source srcSet={appLogo} media="(min-width: 768px)" />
                      <img
                          src={appLogo}
                          alt="Sf Logo"
                          className="w-8 h-8 md:h-6 lg:h-[1.75rem]"
                      />
                  </picture>
                  <h5>{appName}</h5>
          </Link>
          <nav>
            <ul className='flex flex-row gap-4 items-center justify-center'>
              {topBarItems.map((item) => {
                if (item.is_product_list) return productList(item.label)
                else return recursiveBuild(item)
              })}
            </ul>
          </nav>

          {navbarSearch && <SearchWithIcon className="hidden lg:flex flex-[100%] ml-10 relative justify-end" /> }
          <nav className="flex-1 flex justify-end lg:order-last lg:ml-4">
                  <div className="flex flex-row flex-nowrap">
                      {actionItems.map((actionItem) => 
                          {return actionItem.show && <SfButton
                              key={actionItem.ariaLabel}
                              className="relative mr-2 -ml-0.5 rounded-md text-white hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                              aria-label={actionItem.ariaLabel}
                              variant="tertiary"
                              square
                              slotPrefix={actionItem.icon}
                              onClick={actionItem.onClick ?? handlLoginClick}
                          >
                              {actionItem.ariaLabel === 'Cart' && (
                                  <SfBadge content={cartCount} />
                              )}
                              {actionItem.ariaLabel === 'Wishlist' && (
                                  <SfBadge content={WishCount} />
                              )}
                              {actionItem.role === 'login' && (
                                  <p className="inline-flex whitespace-nowrap">{user?.name ?? 'Login'}</p>
                              )}
                          </SfButton>}
                      )}
                  </div>
              </nav>
        </div>
        {navbarSearch && <SearchWithIcon className="flex lg:hidden flex-[100%] my-2 mx-4" /> }
      </header>
    </div>
  );
}