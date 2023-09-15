import {
    SfButton,
    SfIconShoppingCart,
    SfIconFavorite,
    SfIconPerson,
    SfIconMenu,
    SfBadge,
} from '@storefront-ui/react';
import viteLogo from '/vite.svg'
import { useFrappeAuth } from 'frappe-react-sdk';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

const NavHeader = () => {
    const navigate = useNavigate();
    const { cartCount, setIsOpen } = useCart()
    const { currentUser } = useFrappeAuth()

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
            onClick: () => null,
        },
        {
            label: currentUser ?? 'Log in',
            icon: <SfIconPerson />,
            ariaLabel: 'Log in',
            role: 'login',
            onClick: () => currentUser ? navigate('/profile') : navigate('/login'),
        },
    ];



    return (
        <header className="flex justify-center w-full py-2 px-4 lg:py-5 lg:px-6 bg-white border-b border-neutral-200">
            <div className="flex flex-wrap lg:flex-nowrap items-center flex-row justify-start h-full max-w-[1536px] w-full">
                <a
                    href="/"
                    aria-label="SF Homepage"
                    className="flex mr-4 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm shrink-0"
                >
                    <picture>
                        <source srcSet={viteLogo} media="(min-width: 768px)" />
                        <img
                            src={viteLogo}
                            alt="Sf Logo"
                            className="w-8 h-8 md:h-6 lg:h-[1.75rem]"
                        />
                    </picture>
                    <h5>Store</h5>
                </a>
                <SfButton
                    aria-label="Open categories"
                    className="lg:hidden order-first lg:order-1 mr-4"
                    square
                    variant="tertiary"
                >
                    <SfIconMenu />
                </SfButton>


                <nav className="flex-1 flex justify-end lg:order-last lg:ml-4">
                    <div className="flex flex-row flex-nowrap">
                        {actionItems.map((actionItem) => (
                            <SfButton
                                key={actionItem.ariaLabel}
                                className="relative mr-2 -ml-0.5 rounded-md text-primary-700 hover:bg-primary-100 active:bg-primary-200 hover:text-primary-600 active:text-primary-700"
                                aria-label={actionItem.ariaLabel}
                                variant="tertiary"
                                square
                                slotPrefix={actionItem.icon}
                                onClick={actionItem.onClick}
                            >
                                {actionItem.ariaLabel === 'Cart' && (
                                    <SfBadge content={cartCount} />
                                )}
                                {actionItem.role === 'login' && (
                                    <p className="hidden xl:inline-flex whitespace-nowrap">{actionItem.label}</p>
                                )}
                            </SfButton>
                        ))}
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default NavHeader
