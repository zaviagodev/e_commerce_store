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
import viteLogo from '/vite.svg'
import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useWish } from '../hooks/useWishe';

import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { CSSTransition } from 'react-transition-group';
import { useProducts } from '../hooks/useProducts';

import SearchWithIcon from './SearchBar';
  

  
  export default function BaseMegaMenu() {
    const { close, toggle, isOpen } = useDisclosure();
    const drawerRef = useRef(null);
    const menuRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    const navigate = useNavigate();
    const { cartCount, setIsOpen } = useCart();
    const { WishCount,setIsOpen : setWishOpen } = useWish();
    const { user } = useUser();

    const product = useProducts()
    const groupes = product.getProductGroups()

    const actionItems = [
        {
            icon: <SfIconShoppingCart />,
            label: '',
            ariaLabel: 'Cart',
            role: 'button',
            onClick: () => setIsOpen(true)
        },
        {
            icon: <SfIconFavorite />,
            label: '',
            ariaLabel: 'Wishlist',
            role: 'button',
            onClick: () => setWishOpen(true),
        },
        {
            label: user?.name ?? 'Log in',
            icon: <SfIconPerson />,
            ariaLabel: 'Log in',
            role: 'login',
            onClick: () => user?.name === 'Guest' || !user ? navigate('/login') :  navigate('/profile')  ,
        },
    ];
  
    useTrapFocus(drawerRef, {
      activeState: isOpen,
      arrowKeysUpDown: true,
      initialFocus: 'container',
    });
    useClickAway(menuRef, () => {
      close();
    });
  
    const search = (event) => {
      event.preventDefault();
      alert(`Successfully found 10 results for ${inputValue}`);
    };
  
    return (
      <div className="w-full h-full">
        {isOpen && <div className="fixed inset-0 bg-neutral-500 bg-opacity-50 transition-opacity" />}
        <header
          ref={menuRef}
          className="flex flex-wrap md:flex-nowrap justify-center w-full py-2 md:py-5 border-0 bg-primary-700 border-neutral-200 md:relative md:z-10"
        >
          <div className="flex items-center justify-start h-full max-w-[1536px] w-full px-4 md:px-10">
            <SfButton
              className="block md:hidden text-white bg-transparent font-body hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
              aria-haspopup="true"
              aria-expanded={isOpen}
              variant="tertiary"
              onClick={toggle}
              square
            >
              <SfIconMenu className=" text-white" />
            </SfButton>
            <Link to="home/all items" className="flex mr-4 focus-visible:outline text-white focus-visible:outline-offset focus-visible:rounded-sm shrink-0">
                    <picture>
                        <source srcSet={viteLogo} media="(min-width: 768px)" />
                        <img
                            src={viteLogo}
                            alt="Sf Logo"
                            className="w-8 h-8 md:h-6 lg:h-[1.75rem]"
                        />
                    </picture>
                    <h5>Store</h5>
            </Link>
            <SfButton
              className="hidden md:flex text-white bg-transparent font-body hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
              aria-haspopup="true"
              aria-expanded={isOpen}
              slotSuffix={<SfIconExpandMore className="hidden md:inline-flex" />}
              variant="tertiary"
              onClick={toggle}
              square
            >
              <span className="hidden md:inline-flex whitespace-nowrap px-2">Browse products</span>
            </SfButton>
            <nav>
              <ul>
                <li role="none">
                  <CSSTransition
                    in={isOpen}
                    timeout={500}
                    unmountOnExit
                    classNames={{
                      enter: '-translate-x-full md:opacity-0 md:translate-x-0',
                      enterActive: 'translate-x-0 md:opacity-100 transition duration-500 ease-in-out',
                      exitActive: '-translate-x-full md:opacity-0 md:translate-x-0 transition duration-500 ease-in-out',
                    }}
                  >
                    <SfDrawer
                      ref={drawerRef}
                      open
                      disableClickAway
                      placement="top"
                      className="grid grid-cols-1 md:gap-x-6 md:grid-cols-4 bg-white shadow-lg p-0 max-h-screen overflow-y-auto md:!absolute md:!top-20 max-w-[376px] md:max-w-full md:p-6 mr-[50px] md:mr-0 z-50"
                    >
                      <div className="sticky top-0 flex items-center justify-between px-4 py-2 bg-primary-700 md:hidden">
                        <div className="flex items-center font-medium text-white typography-text-lg">Browse products</div>
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
                      {groupes.map(({ name, children }) => (
                        <div key={name} className="[&:nth-child(2)]:pt-0 pt-6 md:pt-0">
                          <h2
                            role="presentation"
                            className="typography-text-base font-medium text-neutral-900 whitespace-nowrap p-4 md:py-1.5"
                          >
                            {name}
                          </h2>
                          <hr className="mb-3.5" />
                          <ul>
                              <Link to={`home/${name}`}   >
                              <li>
                                <SfListItem
                                  as="a"
                                  size="sm"
                                  role="none"
                                  href={`#${name}`}
                                  className="typography-text-base md:typography-text-sm py-4 md:py-1.5"
                                >
                                  {name}
                                </SfListItem>
                              </li>
                              </Link>
                            {children.map(({name, children}) => (
                              <Link to={`home/${name}`}   >
                              <li key={name}>
                                <SfListItem
                                  as="a"
                                  size="sm"
                                  role="none"
                                  href={`#${name}`}
                                  className="typography-text-base md:typography-text-sm py-4 md:py-1.5"
                                >
                                  {name}
                                </SfListItem>
                              </li>
                              </Link>
                            ))}
                          </ul>
                        </div>
                      ))}
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
            <SearchWithIcon className="hidden md:flex flex-[100%] ml-10 relative" /> 
            <nav className="flex-1 flex justify-end lg:order-last lg:ml-4">
                    <div className="flex flex-row flex-nowrap">
                        {actionItems.map((actionItem) => (
                            <SfButton
                                key={actionItem.ariaLabel}
                                className="relative mr-2 -ml-0.5 rounded-md text-white hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                                aria-label={actionItem.ariaLabel}
                                variant="tertiary"
                                square
                                slotPrefix={actionItem.icon}
                                onClick={actionItem.onClick}
                            >
                                {actionItem.ariaLabel === 'Cart' && (
                                    <SfBadge content={cartCount} />
                                )}
                                {actionItem.ariaLabel === 'Wishlist' && (
                                    <SfBadge content={WishCount} />
                                )}
                                {actionItem.role === 'login' && (
                                    <p className="hidden xl:inline-flex whitespace-nowrap">{actionItem.label}</p>
                                )}
                            </SfButton>
                        ))}
                    </div>
                </nav>
          </div>
          <SearchWithIcon className="flex md:hidden flex-[100%] my-2 mx-4" /> 
        </header>
      </div>
    );
  }


  
