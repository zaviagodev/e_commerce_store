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
    SfIconChevronRight,
    SfIconChevronLeft,
  } from '@storefront-ui/react';
import defaultLogo from '../assets/defaultBrandIcon.svg'
import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useWish } from '../hooks/useWishe';
import { useSetting } from '../hooks/useWebsiteSettings';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { CSSTransition } from 'react-transition-group';
import { useProducts } from '../hooks/useProducts';
import { Skeleton } from './Skeleton';

import SearchWithIcon from './SearchBar';
import SelectDropdownPreselected from './dropDown';

import { findParentName } from '../utils/helper';
import { Icons } from './icons';
import MobileHeaderDrawer from './drawers/MobileHeaderDrawer';

 export default function BaseMegaMenu() {

  const { close, toggle, isOpen } = useDisclosure();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const drawerRef = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const { cartCount, setIsOpen, loading:cartLoading } = useCart();
  const { WishCount,setIsOpen : setWishOpen } = useWish();
  const { user,logout } = useUser();

  const [menu ,setMenu] = useState('Menu')
  const [group, setGroup] = useState(null)
  const [navGroup, setNavGroup] = useState(null)
  const [mobileMenuStep, setMobileMenuStep] = useState(0)

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
      showOnMobile: true,
      onClick: (e) => e.preventDefault()
    },
    {
      icon: <Icons.heart className='w-[22px] h-[22px]'/>,
      label: '',
      ariaLabel: 'Wishlist',
      role: 'button',
      show: false,
      showOnMobile: false,
      onClick: () => setWishOpen(true),
    },
    {
      icon: <Icons.shoppingBag01 className='w-[22px] h-[22px]'/>,
      label: '',
      ariaLabel: 'Cart',
      role: 'button',
      show: false,
      showOnMobile: true,
      onClick: () => setIsOpen(true)
    },
  ]);

  useEffect(() => {
    if(isLoading) return;
    setActionItems(prev => prev.map((item, index) => {
      if ((index === 2 && !hideWish) || (index === 3 && !hideCheckout) || (index ==1 && navbarSearch) ) {
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
                className="py-4 md:py-1.5 rounded-lg active:font-semibold font-semibold"
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
          className="font-semibold text-neutral-900 whitespace-nowrap p-0 lg:p-4 lg:mb-9"
        >
          {itemTop.name}
        </h2>
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
                className="py-4 md:py-1.5 rounded-lg active:font-semibold font-semibold text-[#909090]"
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
    else {
      navigate(`https://${url}`)
    };
  }

  const handleClickProduct = (label) => {
    setMenu(label);
    setMobileMenuStep(mobileMenuStep + 1)
    toggle()
  }

  const handleMobileGoBack = () => {
    if (mobileMenuStep == 0){setMenu('Menu')}
    if (mobileMenuStep > 0){
      setMobileMenuStep(mobileMenuStep - 1)
    }
  }

    const productList = (name) => 
        <>
        <SfButton
          className="!p-0 lg:!p-2 flex w-full lg:w-fit justify-between text-black bg-transparent font-body hover:bg-white hover:text-black active:bg-white active:text-black gap-[2px]"
          aria-haspopup="true"
          aria-expanded={isOpen}
          slotSuffix={<SfIconExpandMore className="inline-flex -rotate-90 lg:rotate-0" />}
          variant="tertiary"
          onClick={() => handleClickProduct(name)}
          square
        >
        <span className="inline-flex whitespace-nowrap font-semibold">{name}</span>
        </SfButton>
        <nav className='absolute top-0 right-0 w-full'>
          <ul>
              <li role="none" className='hidden lg:block'>
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
                      className="grid grid-cols-1 lg:grid-cols-4 bg-white shadow-lg p-0 max-h-screen overflow-y-auto lg:!absolute lg:!top-[57px] max-w-[376px] lg:max-w-full lg:p-6 mr-[50px] lg:mr-0 z-99"
                    >
                      <div className="sticky top-0 flex items-center justify-between p-2 bg-primary lg:hidden">
                        <div className="flex items-center font-semibold text-white typography-text-lg">{menu}</div>
                        <SfButton
                          square
                          variant="tertiary"
                          aria-label="Close navigation menu"
                          onClick={close}
                          className="text-black ml-2"
                        >
                          <SfIconClose />
                        </SfButton>
                      </div>
                      {menu == name  && (group  ? 
                        <SecondaryProdNav group={group} groups={mainGroup} setGroup={setGroup} /> 
                        : 
                        mainGroup.map((item) => (
                          <div className="lg:block hidden lg:border-r lg:px-6">
                            {recursiveBuildPhone(item)}
                          </div>
                        )))               
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
                                      className="py-4 md:py-1.5 rounded-lg active:font-semibold text-sm"
                                    >
                                      {item.label}
                                    </SfListItem>
                                    </li> 
                                    {item.children.length > 0 && <SfIconExpandMore className="inline-flex m-2 -rotate-90 absolute right-0" />}
                                </SfButton> 
                            ))
                        }
                        </> : topBarItems.find(item => item.label === menu).children?.map((item) =>  
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
                                  className=" pl-2 flex w-full flex-row items-center justify-between text-sm"
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
                        className="block md:absolute md:right-0 hover:bg-white active:bg-white"
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
        <li className='w-full lg:w-fit'> 
          <SfButton
            key={item.label}
            className="!p-0 lg:!p-2 flex justify-between w-full lg:w-fit text-black bg-transparent !font-semibold hover:bg-white hover:text-black active:bg-white active:text-black text-sm"
            aria-label={item.label}
            variant="tertiary"
            square
            onClick={() => handleClick(item.url)}
          >
            {item.label}
            <SfIconChevronRight className='lg:hidden'/>
          </SfButton>
        </li>
      if(item.children.length === 0) return button
      if(item.children.length > 0) return  <SelectDropdownPreselected dropdowndame={item.label}  options={item.children} />
    }

  return (
    <div className="w-full h-full">
      {isMobileMenuOpen && <div className="fixed inset-0 bg-neutral-500 bg-opacity-50 transition-opacity z-60" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}/>}
      <MobileHeaderDrawer isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen}>
        <section className='flex flex-col gap-y-9'>
          {menu !== 'Menu' && mobileMenuStep > 0 ? (
            <div className='flex items-center gap-x-[10px]'>
              <SfIconChevronLeft onClick={handleMobileGoBack}/>
              <p className="inline-flex whitespace-nowrap font-semibold">{menu}</p>
            </div>
          ) : (
            <div className='flex items-center gap-x-[10px]' onClick={handlLoginClick}>
              <p className="inline-flex whitespace-nowrap font-semibold">{user?.name ?? 'เข้าสู่ระบบ'}</p>
            </div>
          )}
          <nav>
            <ul className='flex flex-col gap-4 font-semibold'>
              {!isLoading ? (
                <>{topBarItems.map((item) => {
                  if (mobileMenuStep > 0){
                    if (item.is_product){
                      return <>{mainGroup.map((item) => {
                        return(
                          <div className="lg:hidden">
                            {recursiveBuildPhone(item)}
                          </div>
                        )}
                      )}</>
                    }
                  } else {
                    if (item.is_product) return productList(item.label)
                    else return recursiveBuild(item)
                  }
                })}</>
              ) : (
                <Skeleton className='h-8 w-[200px]'/>
              )}
            </ul>
          </nav>
          {user?.name && 
            <div className='flex items-center gap-x-[10px] font-semibold' onClick={() => {
              logout();
              navigate(`/`);
            }}>
            <Icons.login className='w-[22px] h-[22px]'/>
              Logout
            </div>
          }
        </section>
      </MobileHeaderDrawer>
      <header
        ref={menuRef}
        onClick={isOpen && toggle}
        className="flex flex-wrap lg:flex-nowrap justify-center w-full py-2 lg:py-5 border-0 bg-white border-neutral-200 lg:relative z-99 h-[57px] border-b border-b-[#F4F4F4]"
      >
        <div className="grid grid-cols-3 lg:grid-cols-1 lg:flex items-center justify-between h-full max-w-[1400px] box-content w-full px-4 lg:px-10">
          <SfButton
            className="flex !justify-start lg:hidden text-black bg-transparent font-semibold hover:bg-white hover:text-black active:bg-white active:text-black"
            aria-haspopup="true"
            aria-expanded={isMobileMenuOpen}
            variant="tertiary"
            onHover={setIsMobileMenuOpen}
            onClick={setIsMobileMenuOpen}
            square
          >
            <SfIconMenu className=" text-black" />
          </SfButton>
          <div className='flex justify-center lg:justify-start lg:gap-x-10'>
            <Link to="home/all items" className="flex focus-visible:outline text-black focus-visible:outline-offset focus-visible:rounded-sm shrink-0">
              {appLogo === null ? (
                  <Skeleton className='h-8 w-[120px]'/>
              ) : (
                  <picture>
                  <source srcSet={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo} media="(min-width: 768px)" />
                  <img
                      src={appLogo ? `${import.meta.env.VITE_ERP_URL ?? ''}${appLogo}` : defaultLogo}
                      alt="Sf Logo"
                      className='max-h-[43px]'
                  />
                  </picture>
              )}
            </Link>
            <nav className='hidden lg:block'>
              <ul className='flex flex-row gap-4 items-center justify-center font-semibold'>
                {!isLoading ? (
                  <>{topBarItems.map((item) => {
                    if (item.is_product) return productList(item.label)
                    else return recursiveBuild(item)
                  })}</>
                ) : (
                  <Skeleton className='h-8 w-[200px]'/>
                )}
              </ul>
            </nav>
          </div>

            <nav className="flex justify-end lg:order-last lg:ml-4">

              <div className="flex flex-row flex-nowrap gap-x-2 items-center">
                {!isLoading ? (
                  <>{actionItems.map((actionItem) => 
                    {return actionItem.show && <SfButton
                          key={actionItem.ariaLabel}
                          className={`relative rounded-md text-black hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700 ${!actionItem.showOnMobile ? 'hidden lg:block' : ''}`}
                          aria-label={actionItem.ariaLabel}
                          variant="tertiary"
                          square
                          slotPrefix={actionItem.icon}
                          onClick={actionItem.onClick}
                      >
                          {actionItem.ariaLabel === 'Cart' && (
                            <SfBadge content={cartCount} className='!text-black !text-xs !bg-gray-300 w-4 h-4 flex items-center justify-center !p-0'/>
                          )}
                          {actionItem.ariaLabel === 'Search' && (
                            <SearchWithIcon className="flex" /> 
                          )}
                          {actionItem.ariaLabel === 'Wishlist' && (
                            <SfBadge content={WishCount} className='!text-black !text-xs !bg-[#FF8C8C] w-4 h-4 flex items-center justify-center !p-0'/>
                          )}
                          {actionItem.role === 'login' && (
                            <div className='hidden lg:flex items-center gap-x-[10px] border-r-2 pr-6'>
                              <p className="inline-flex whitespace-nowrap font-semibold text-sm" onClick={handlLoginClick}>{user?.name ?? 'เข้าสู่ระบบ'}</p>
                                {user?.name && <Icons.login onClick={() => {
                                  logout();
                                  navigate(`/`);
                                }} className='w-[22px] h-[22px]'/>}
                            </div>
                          )}
                      </SfButton>}
                    )}</>
                ) : (
                  <Skeleton className='h-8 w-[200px]'/>
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
                  className="py-4 md:py-1.5 rounded-lg active:font-semibold text-sm"
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
    <div className='w-full h-full flex  flex-col justify-center items-start'>
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
                  className="text-sm py-4 md:py-1.5 rounded-lg active:font-semibold"
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