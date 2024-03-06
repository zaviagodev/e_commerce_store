import {
    SfIconExpandMore,
    SfIconClose,
    SfButton,
    SfDrawer,
    SfListItem,
    useDisclosure,
    useTrapFocus,
    SfBadge,
    SfIconMenu,
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
import defaultAvatar from "../assets/default-avatar.svg"

import SearchWithIcon from './SearchBar';
import SelectDropdownPreselected from './dropDown';


import { Icons } from './icons';
import MobileHeaderDrawer from './drawers/MobileHeaderDrawer';
import Modal from './drawers/Modal';
import { IsInProductList, handleClick } from '../utils/helper';

export default function BaseMegaMenu() {

  const { close, toggle, isOpen } = useDisclosure();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const drawerRef = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const { cartCount, setIsOpen } = useCart();
  const { WishCount,setIsOpen : setWishOpen } = useWish();
  const { user,logout } = useUser();

  const [menu ,setMenu] = useState({item : null, prevItem : null})
  const [mobileMenuStep, setMobileMenuStep] = useState(0)
  const [changingMenu, setChangingMenu] = useState('')

  const {mainGroup} = useProducts()
  const { isOpen:isLogoutOpen, open:openLogout, close:closeLogout } = useDisclosure({ initialValue: false });


  const {appLogo,hideLogin, hideCheckout, navbarSearch, topBarItems, hideWish, isLoading} = useSetting()

  const handlLoginClick = () => {
      if (user && user.name !== 'Guest') 
        {
          if (window.innerWidth <= 768)  // 768px is a common breakpoint for mobile devices
          {
            navigate('/profile/true');
          }else{
            navigate('/profile');
          }
        } 
      else 
        {
          navigate('/login');
          
        }
        setIsMobileMenuOpen(false)
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
  }  , [hideWish, hideCheckout, hideLogin, isLoading, navbarSearch, user]);

  useTrapFocus(drawerRef, {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: 'container',
  });
  useClickAway(menuRef, () => {
    close();
  });

  function BuildDesktop(itemTop){
    return(
    <div key={itemTop.name} className="pt-0">
      <Link to={`/home/${itemTop.name}`}   
        role="presentation"
        className="text-base font-semibold text-neutral-900 whitespace-nowrap p-4 md:py-1.5 mb-3 inline-block"
        onClick={() => setIsMobileMenuOpen(false)}
        >
        {itemTop.name}
        </Link>
      {/* <hr className="mb-3.5" /> */}
      <ul className='flex flex-col gap-y-3'>
        {
        itemTop.children?.map((subItem) => 
        <Link to={`/home/${subItem?.name}`} onClick={() => setIsMobileMenuOpen(false)}>
          <li key={subItem?.name}>
            <SfListItem
              as="div"
              size="sm"
              role="none"
              className="py-4 md:py-1.5 rounded-lg active:font-bold font-semibold text-[#909090] hover:text-black hover:bg-white active:bg-white"
            >
              {subItem?.name}
            </SfListItem>
          </li>
        </Link> 
        )}
      </ul> 
    </div>
    )
  }

  const handleChangeMenu = (anim, func) => {
    setChangingMenu(anim);
    setTimeout(() => {
      func()
    }, 300)
    setTimeout(() => {
      setChangingMenu('')
    }, 600)
  }

  const clickToLogout = () => {
    logout();
    navigate(`/`);
  }

  const resetPhoneMenu = () => {
    setMobileMenuStep(0)
    setMenu({item : null, prevItem : null})
  }

  const handleMobileGoBack = () => {
    handleChangeMenu('slide-back', () => {
      if (mobileMenuStep == 1){
        resetPhoneMenu()
      }
      if (mobileMenuStep > 1){
        setMenu({item : menu.prevItem, prevItem : null})
        setMobileMenuStep(mobileMenuStep - 1)
      }
    })
  }

  const handleLogoutMobile = () => {
    openLogout()
    setIsMobileMenuOpen(false)
  }

  const handlePhoneMenuClick = (item, product = false) => {
    handleChangeMenu('slide-next', () => {
      if (item.is_product_list) {
        setMobileMenuStep((prev) => prev + 1)
        setMenu({item : item, prevItem : menu.item})
        return
      }
      if ((product || IsInProductList(mainGroup, item.name)) && (mobileMenuStep > 1 || item.children.length == 0)) {
        resetPhoneMenu()
        setIsMobileMenuOpen(false)
        navigate(`/home/${item.name}`)
        return
      }
      if (item.children.length === 0 && !product) {
        resetPhoneMenu()
        setIsMobileMenuOpen(false)
        handleClick(item.url, item.open_in_new_tab === 1, navigate)
        return
      }
      setMobileMenuStep((prev) => prev + 1)
      setMenu({item : item, prevItem : menu.item})
    })
  }

  function MobileProductMenu (){
    return <>
      {menu.item?.is_product_list ?  
        <div className='flex flex-col gap-y-6'>
          <div className='flex flex-col gap-y-8'>
            {topBarItems.filter((item) => item.is_product_list).name}
            {mainGroup.map((item) => 
              <button onClick={() => handlePhoneMenuClick(item, true)} className={`${mobileMenuStep == 2 ? 'text-[#343434] px-4' : ''} text-[24px] flex justify-between items-center`}>
                {item?.name}
                {item?.children?.length > 0 ? <SfIconChevronRight/> : null}
              </button>
            )}
          </div>
        </div>
        :
        <div className='flex flex-col gap-y-6'>
          <div className='flex flex-col gap-y-4'>
            <Link className={`${mobileMenuStep == 2 ? 'text-[24px] mb-6' : ''}`} to={`/home/${menu.item?.name}`} onClick={() => setIsMobileMenuOpen(false)}>{IsInProductList(mainGroup, menu.item?.name) && menu.item?.name}</Link>
            <div className='flex flex-col gap-y-8'>
              {menu.item?.children.map((item) => 
                <button onClick={() => handlePhoneMenuClick(item, !item?.label && true)} className={`${mobileMenuStep == 2 ? 'text-[#343434] px-4' : ''} flex justify-between items-center`}>
                  {item?.name}
                  {/* {item?.children?.length > 0 ? <SfIconChevronRight/> : null} */}
                </button>
              )}
            </div>
          </div>
        </div>
      }
    </>
  }

  const productList = (name) => 
  <>
    <SfButton
      className="hidden lg:flex text-black bg-transparent font-body hover:bg-white hover:text-black active:bg-white active:text-black gap-[2px]"
      aria-haspopup="true"
      aria-expanded={isOpen}
      slotSuffix={<SfIconExpandMore className="hidden lg:inline-flex" />}
      variant="tertiary"
      onClick={toggle}
      square
    >
      <span className="hidden lg:inline-flex whitespace-nowrap text-sm font-bold">{name}</span>
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
                className="bg-white shadow-lg p-0 max-h-screen overflow-y-auto lg:!absolute lg:!top-[57px] max-w-[376px] lg:max-w-full lg:px-10 lg:pt-10 lg:pb-[100px] mr-[50px] lg:mr-0 z-99"
              >
                <div className="sticky top-0 flex items-center justify-between p-2 bg-primary lg:hidden">
                  <div className="flex items-center font-bold text-black typography-text-lg">{menu.item?.name}</div>
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
                <div className='max-w-[1400px] mx-auto grid grid-cols-1 lg:gap-y-[46px] lg:grid-cols-4'>
                  {
                    mainGroup.map(
                      (item) => 
                      {
                        return(
                          <div className="lg:block hidden px-6">
                            {BuildDesktop(item)}
                          </div>
                        )
                      }
                    )
                  }
                </div>
                {/* <SfButton
                  square
                  variant="tertiary"
                  aria-label="Close navigation menu"
                  onClick={close}
                  className="hidden md:block md:absolute md:right-0 hover:bg-white active:bg-white md:top-0"
                >
                  <SfIconClose />
                </SfButton> */}
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
            onClick={() => handleClick(item.url, item.open_in_new_tab === 1, navigate)}
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
      <Modal isOpen={isLogoutOpen} close={closeLogout} open={openLogout}>
        <div className='flex flex-col gap-y-6'>
            <h1 className='text-black text-2xl font-semibold'>ออกจากระบบ ?</h1>
            <p className='text-darkgray'>หากต้องการตรวจสอบข้อมูลการชำระเงินและประวัติคำสั่งซื้อ กรุณาเข้าสู่ระบบอีกครั้ง</p>
        </div>

        <div className='flex gap-x-3 w-full'>
          <SfButton variant='tertiary' className='w-full btn-secondary h-[50px] rounded-xl' onClick={closeLogout}>
            ยกเลิก
          </SfButton>
          <SfButton variant='tertiary' className='w-full btn-primary h-[50px] rounded-xl' onClick={clickToLogout}>
            ออกจากระบบ
          </SfButton>
        </div>
      </Modal>

      <MobileHeaderDrawer isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen}>
        <section className='flex flex-col justify-between h-full'>
          <div className={`flex flex-col gap-y-9 ${changingMenu}`}>
            {mobileMenuStep > 0 ? (
              <div className='flex items-center gap-x-[10px]'>
                <SfIconChevronLeft onClick={handleMobileGoBack}/>
                <p className="inline-flex whitespace-nowrap font-semibold">{menu.prevItem ? menu.prevItem.name : 'Home'}</p>
              </div>
            ) : (
              <div className='flex items-center gap-x-[10px]' onClick={handlLoginClick}>
                {user?.name ? (
                  <img
                    className="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none w-6 h-6 object-cover"
                    src={user?.user?.user_image ? `${import.meta.env.VITE_ERP_URL || ""}${user.user.user_image}` : defaultAvatar}
                    width="24"
                    height="24"
                    alt="User Image"
                  />
                ) : (
                  <Icons.user01 />
                )}
                <p className="inline-flex whitespace-nowrap font-semibold">{user?.name ?? 'เข้าสู่ระบบ'}</p>
              </div>
            )}
            <nav>
              <ul className='flex flex-col gap-8 font-semibold'>
                {!isLoading ? (
                  <>{mobileMenuStep == 0 ? topBarItems.map((item) => {
                      return(
                        <button onClick={() => handlePhoneMenuClick(item)} className="text-[24px] flex justify-between items-center">
                          {item?.name}
                          {item?.children?.length > 0 || item?.is_product_list ? <SfIconChevronRight/> : null}
                        </button>
                      )
                    }
                  ) : 
                  <MobileProductMenu/>
                  }</>
                ) : (
                  <Skeleton className='h-8 w-20 lg:w-[200px]'/>
                )}
              </ul>
            </nav>
          </div>
          {user?.name && 
            <div className='flex items-center gap-x-[10px] font-semibold' onClick={handleLogoutMobile}>
              <Icons.login className='w-[22px] h-[22px]'/>
              ออกจากระบบ
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
                  <Skeleton className='h-8 w-10 lg:w-[120px]'/>
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
                    if (item.is_product_list) return productList(item.label)
                    else return recursiveBuild(item)
                  })}</>
                ) : (
                  <Skeleton className='h-8 w-20 lg:w-[200px]'/>
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
                                {user?.name && <>
                                  <Icons.login onClick={openLogout} className='w-[22px] h-[22px]'/>
                                </>}
                            </div>
                          )}
                      </SfButton>}
                    )}</>
                ) : (
                  <Skeleton className='h-8 w-20 lg:w-[200px]'/>
                )}
              </div>
            </nav>
          </div>
      </header>
    </div>
    );
  }