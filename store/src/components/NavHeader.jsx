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
    SfIconArrowBack,
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

import { findParentName } from '../utils/helper';



 export default function BaseMegaMenu() {
   
    const { close, toggle, isOpen } = useDisclosure();
    const drawerRef = useRef(null);
    const menuRef = useRef(null);

  const navigate = useNavigate();
  const { cartCount, setIsOpen } = useCart();
  const { WishCount,setIsOpen : setWishOpen } = useWish();
  const { user } = useUser();

    const [menu ,setMenu] = useState('Menu')
    const [group, setGroup] = useState(null)
    const [navGroup, setNavGroup] = useState(null)

    const {mainGroup} = useProducts()
    
  const product = useProducts()



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
      icon: <></>,
      label: '',
      ariaLabel: 'Search',
      role: 'search',
      show: false,
      onClick: (e) => e.preventDefault()
    },
    {
      icon: <SfIconFavorite />,
      label: '',
      ariaLabel: 'Wishlist',
      role: 'button',
      show: false,
      onClick: () => setWishOpen(true),
    },
    {
      icon: <SfIconShoppingCart />,
      label: '',
      ariaLabel: 'Cart',
      role: 'button',
      show: false,
      onClick: () => setIsOpen(true)
    },
  ]);

  useEffect(() => {
    if(isLoading) return;
    setActionItems(prev => prev.map((item, index) => {
      if ((index === 3 && !hideWish) || (index === 2 && !hideCheckout) || (index ==1 && navbarSearch) ) { // Original: (index === 2 && !hideWish) || (index === 1 && !hideCheckout)
        return { ...item, show: true };
      }
      if (index === 0 && !hideLogin  ) {
        return { ...item, show: true };
      }
      return item;
    }));
}, [hideWish, hideCheckout, hideLogin, isLoading, navbarSearch, user]);

  useTrapFocus(drawerRef, {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: 'container',
  });
  useClickAway(menuRef, () => {
    close();
  });

   function recursiveBuildPhone (itemTop){
      const handleClick = (item) => {
        if (item.children.length == 0)
        {
          navigate('/home/' + item.name)
        }
        else{
          setGroup(item)
        }
      }

      const recurse = (item) => {
        return(
          <div onClick={() => handleClick(item)}  className='flex flex-1 items-center justify-between relative'>
            <li key={item.name} className='flex-1'>
              <SfListItem
                as="div"
                size="sm"
                role="none"
                className="typography-text-base md:typography-text-sm py-4 md:py-1.5 rounded-lg active:font-medium"
              >
                {item.name}
              </SfListItem>
            </li> 
            {item.children.length > 0 && <SfIconExpandMore className=" inline-flex m-2 -rotate-90 absolute right-0" />}
          </div> 
        )
      }

      return(
      <div key={itemTop.name} className="pt-0">
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
                as="div"
                size="sm"
                role="none"
                className="typography-text-base md:typography-text-sm py-4 md:py-1.5 rounded-lg active:font-medium"
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
                      className="grid grid-cols-1 lg:gap-x-6 lg:grid-cols-4 bg-white shadow-lg p-0 max-h-screen overflow-y-auto lg:!absolute lg:!top-[60px] max-w-[376px] lg:max-w-full lg:p-6 mr-[50px] lg:mr-0 z-99"
                    >
                      <div className="sticky top-0 flex items-center justify-between p-2 bg-primary lg:hidden">
                        <div className="flex items-center font-medium text-white typography-text-lg">{menu}</div>
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
                      
                          {mainGroup.map((item) => {
                          return(
                            <div className="lg:block hidden">
                              {recursiveBuildPhone(item)}
                            </div>
                          )
                          }
                          )}
                      <div className='flex lg:hidden flex-col gap-2'>
                        {menu == 'Menu' ? topBarItems.map((item) => (
                          <SfButton
                            variant={'tertiary'}
                            onClick={()=>{setMenu(item.label)}}
                            className='justify-start w-full'
                          >
                            {item.name}
                          </SfButton>
                        )) :
                        <button onClick={() => {setMenu('Menu'), setNavGroup(null)}} className='flex flex-row gap-2 items-center justify-start p-2'><SfIconArrowBack/>Back</button>
                        }
                      </div>
                      {menu == name  && (group  ? 
                        <SecondaryProdNav group={group} groups={mainGroup} setGroup={setGroup} /> 
                        : 
                        mainGroup.map((item) => recursiveBuildPhone(item)))               
                        }
                      {menu != 'Menu' && (navGroup ? 
                        <>
                            <button onClick={() => setNavGroup(null)} className='flex flex-row gap-2 items-center justify-between p-2'><SfIconArrowBack/>  { navGroup ? findParentName(topBarItems, navGroup.name) : 'Back'} </button>
                            {navGroup.children.map((item) => (
                                <SfButton variant={'tertiary'} onClick={() => 
                                    {
                                    if(item.children.length > 0 )
                                        {
                                        setNavGroup(item)
                                        }
                                    if(item.children.length ==0 && item.url)
                                        {
                                          handleClick(item.url)
                                        }
                                }} className='flex flex-1 pl-2 items-center justify-between relative'>
                                    <li key={item.name} className='flex-1'>
                                    <SfListItem
                                      as="div"
                                      size="sm"
                                      role="none"
                                      className="typography-text-base md:typography-text-sm py-4 md:py-1.5 rounded-lg active:font-medium"
                                    >
                                      {item.name}
                                    </SfListItem>
                                    </li> 
                                    {item.children.length > 0 && <SfIconExpandMore className="inline-flex m-2 -rotate-90 absolute right-0" />}
                                </SfButton> 
                            ))
                        }
                        </> : topBarItems.find(item => item.name === menu).children.map((item) =>  
                              <li> 
                                <SfButton
                                  onClick={() => 
                                    {
                                      if(item.children.length == 0)
                                      {
                                        handleClick(item.url)
                                      }else{
                                        setNavGroup(item)
                                      }
                                    }
                                  }
                                  key={item.label}
                                  className=" pl-2 flex w-full flex-row items-center justify-between"
                                  aria-label={item.label}
                                  variant="tertiary"
                                  square
                                >{item.label}
                                {!item.children.length == 0 && <SfIconExpandMore className='-rotate-90'/>}
                                </SfButton>
                            </li>
                         )
                      )}
                      <SfButton
                        square
                        variant="tertiary"
                        aria-label="Close navigation menu"
                        onClick={close}
                        className="hidden md:block md:absolute md:right-0 hover:bg-white active:bg-white"
                      >
                        <SfIconClose />
                      </SfButton>
                    </SfDrawer>
                  </CSSTransition>
                </li>
          </ul>
        </nav>
        </>

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
        onClick={isOpen && toggle}
        className="flex flex-wrap lg:flex-nowrap justify-center w-full py-2 lg:py-5 border-0 bg-primary border-neutral-200 lg:relative z-99 h-15"
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
          <Link to="home/all items" className="flex mr-6 focus-visible:outline text-white focus-visible:outline-offset focus-visible:rounded-sm shrink-0">
              <picture>
                  <source srcSet={`${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}`} media="(min-width: 768px)" />
                  <img
                      src={`${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}`}
                      alt="Sf Logo"
                      className='max-h-6'
                  />
              </picture>
          </Link>
          <nav>
            <ul className='flex flex-row gap-2 items-center justify-center'>
              {topBarItems.map((item) => {
                if (item.is_product_list) return productList(item.label)
                else return recursiveBuild(item)
              })}
            </ul>
          </nav>

            <nav className="flex-1 flex justify-end lg:order-last lg:ml-4">
                    <div className="flex flex-row flex-nowrap gap-x-2 items-center">
                        {actionItems.map((actionItem) => 
                            {return actionItem.show && <SfButton
                                key={actionItem.ariaLabel}
                                className="relative rounded-md text-white hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                                aria-label={actionItem.ariaLabel}
                                variant="tertiary"
                                square
                                slotPrefix={actionItem.icon}
                                onClick={actionItem.onClick ?? handlLoginClick}
                            >
                                {actionItem.ariaLabel === 'Cart' && (
                                    <SfBadge content={cartCount} />
                                )}
                                {actionItem.ariaLabel === 'Search' && (
                                    <SearchWithIcon className="flex" /> 
                                )}
                                {actionItem.ariaLabel === 'Wishlist' && (
                                    <SfBadge content={WishCount} />
                                )}
                                {actionItem.role === 'login' && (
                                    <p className="inline-flex whitespace-nowrap border-r border-r-white pr-6">{user?.name ?? 'Login'}</p>
                                )}
                            </SfButton>}
                        )}
                    </div>
                </nav>
          </div>
        </header>
      </div>
    );
  }



  function SecondaryOtherNav ({group, groups, setNavGroup, handleClick}){

    const handleSubClick = (item) => {
      if(item.children.length > 0 )
      {
        setGroup(item.name)
      }
      if(item.children.length ==0)
      {
        handleClick(item.url)
      }
    }

    return (
      <div className='w-full h-full flex flex-col justify-center items-start'>
      <button onClick={setNavGroup(null)} className='flex flex-row gap-2 items-center justify-between p-2'><SfIconArrowBack/>  { group ? findParentName(groups, group.name) : 'Back'} </button>
      {group && 
        group.children.map((item) => (
            <SfButton variant={'tertiary'} onClick={handleSubClick} className='flex flex-1 pl-2 items-center justify-between relative'>
                <li key={item.name} className='flex-1'>
                <SfListItem
                  as="div"
                  size="sm"
                  role="none"
                  className="typography-text-base md:typography-text-sm py-4 md:py-1.5 rounded-lg active:font-medium"
                >
                  {item.name}
                </SfListItem>
                </li> 
                {item.children.length > 0 && <SfIconExpandMore className=" inline-flex m-2 -rotate-90 absolute right-0" />}
            </SfButton> 
        ))
    }
    </div>
    )
  }
  

function SecondaryProdNav ({group, groups, setGroup}){

  const navigate = useNavigate()

  const handleClick = (item) => 
  {
    if(item.children.length > 0 )
    {
      setGroup(item.name)
    }
    if(item.children.length ==0)
    {
      navigate(`/home/${item.name}`)
    }
  }

  return (
    <div className='w-full h-full flex  flex-col justify-center items-start' >
    <button onClick={() => {setGroup(null)}} className='flex flex-row gap-2 items-center justify-between p-2'><SfIconArrowBack/>  { group ? findParentName(groups, group.name) : 'Back'} </button>
    {group && 
      group.children.map((item) => (
          <SfButton variant={'tertiary'} onClick={() => handleClick(item)} className='flex flex-1 pl-2 items-center justify-between relative'>
              <li key={item.name} className='flex-1'>
              <SfListItem
                  as="a"
                  size="sm"
                  role="none"
                  href={`#${item.name}`}
                  className="typography-text-base md:typography-text-sm py-4 md:py-1.5 rounded-lg active:font-medium"
              >
                  {item.name}
              </SfListItem>
              </li> 
              {item.children.length > 0 && <SfIconExpandMore className=" inline-flex m-2 -rotate-90 absolute right-0" />}
          </SfButton> 
      ))
  }
  </div>
  )
}


  
