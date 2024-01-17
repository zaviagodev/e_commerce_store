import { useState, useRef } from 'react';
import { useDebounce } from 'react-use';
import { offset } from '@floating-ui/react-dom';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { CSSTransition } from 'react-transition-group';
import {
  SfButton,
  SfInput,
  SfIconSearch,
  SfIconCancel,
  useDisclosure,
  SfListItem,
  SfLoaderCircular,
  useTrapFocus,
  useDropdown,
  SfIconClose,
  SfDrawer
} from '@storefront-ui/react';
import { useSetting } from '../hooks/useWebsiteSettings';
import { Link } from 'react-router-dom';
import { Icons } from './icons';

// Just for presentation purposes. Replace mock request with the actual API call.
// eslint-disable-next-line no-promise-executor-return
const delay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

export default function SearchWithIcon( {className}) {
    const { products } = useProducts();
    const navigate = useNavigate();
    const mockAutocompleteRequest = async (phrase) => {
    await delay();
    const results = products
      .filter((product) => product.web_item_name.toLowerCase().startsWith(phrase.toLowerCase()))
      .map((product) => {
        const highlight = product.web_item_name.substring(0, phrase.length);
        const rest = product.web_item_name.substring(phrase.length);
        return { highlight, rest, product };
      });
    return results;
  };

  const inputRef = useRef(null);
  const dropdownListRef = useRef(null);
  const drawerRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const { isOpen, close, open } = useDisclosure();
  
  const { refs, style } = useDropdown({
    isOpen,
    onClose: close,
    placement: 'bottom-start',
    middleware: [offset(4)],
  });
  const { focusables: focusableElements, updateFocusableElements } = useTrapFocus(dropdownListRef, {
    trapTabs: false,
    arrowKeysUpDown: true,
    activeState: isOpen,
    initialFocus: false,
  });
  const isResetButton = Boolean(searchValue);

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setSearchValue('');
    setSnippets([]);
    close();
    handleFocusInput();
  };

  const handleChange = (event) => {
    const phrase = event.target.value;
    if (phrase) {
      setSearchValue(phrase);
    } else {
      setSearchValue('')
    }
  };

  const handleSelect = (phrase) => () => {
    setSearchValue(phrase.web_item_name);
    close();
    handleFocusInput();
    navigate(`/products/${phrase.name}`);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Escape') handleReset();
    if (event.key === 'ArrowUp') {
      open();
      updateFocusableElements();
      if (isOpen && focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
    }
    if (event.key === 'ArrowDown') {
      open();
      updateFocusableElements();
      if (isOpen && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };

  useDebounce(
    () => {
      if (searchValue) {
        const getSnippets = async () => {
          open();
          setIsLoadingSnippets(true);
          try {
            const data = await mockAutocompleteRequest(searchValue);
            setSnippets(data);
          } catch (error) {
            close();
            console.error(error);
          }
          setIsLoadingSnippets(false);
        };

        getSnippets();
      }
    },
    500,
    [searchValue],
  );

  return (
    <form role="search" onSubmit={e => e.preventDefault()} ref={refs.setReference} className={className}>
      <nav className='fixed top-0 right-0 w-full z-[999] text-black'>
        <ul>
            <li role="none">
                <CSSTransition
                  in={isOpen}
                  timeout={500}
                  unmountOnExit
                  classNames={{
                    enter: 'opacity-0 translate-x-0',
                    enterActive: 'translate-x-0 opacity-100 transition duration-300 ease-in-out',
                    exitActive: 'opacity-0 translate-x-0 transition duration-300 ease-in-out',
                  }}
                >
                  <SfDrawer
                    ref={drawerRef}
                    open
                    disableClickAway
                    placement="top"
                    className="bg-white shadow-lg py-5 absolute top-0 max-w-full z-99"
                  >
                    <div className='w-full lg:max-w-[512px] relative mx-auto px-4'>
                      <div className="flex relative justify-center gap-2 lg:gap-0">
                        <SfInput
                          ref={inputRef}
                          value={searchValue}
                          onChange={handleChange}
                          wrapperClassName={`w-full border-0 shadow-none focus-within:shadow-none`}
                          aria-label="Search"
                          placeholder="Search 'MacBook' or 'iPhone'..."
                          onKeyDown={handleInputKeyDown}
                          slotPrefix={<SfIconSearch />}
                          slotSuffix={isResetButton && (
                            <SfIconClose className='cursor-pointer' onClick={() => setSearchValue('')}/>
                          )}
                        />
                        <div className='justify-end inline-flex lg:hidden'>
                          <SfButton
                            square
                            size="sm"
                            variant="tertiary"
                            aria-label="Close navigation menu"
                            onClick={close}
                            className="scale-95 hover:scale-100 transition duration-200"
                          >
                            {/* <SfIconClose className="text-neutral-500" /> */}
                            Cancel
                          </SfButton>
                        </div>
                      </div>
                      <div ref={refs.setFloating} className="left-0 right-0 py-4">
                        {isLoadingSnippets ? (
                          <div className="flex items-center justify-center bg-white w-full sm:h-20">
                            <SfLoaderCircular />
                          </div>
                        ) : (
                          <>
                          {searchValue !== "" && (
                          <ul
                            ref={dropdownListRef}
                            className="bg-white w-full"
                          >
                              {snippets.length > 0 ? (
                                <>
                                  {snippets.map(({ highlight, rest, product }) => (
                                    <li key={product.name}>
                                      <SfListItem
                                        as="button"
                                        type="button"
                                        onClick={handleSelect(product)}
                                        className="flex justify-start rounded-md"
                                      >
                                        <p className="text-left">
                                          <span>{highlight}</span>
                                          <span className="font-medium">{rest}</span>
                                        </p>
                                        <p className="text-left typography-text-xs text-neutral-500">{product.item_group}</p>
                                      </SfListItem>
                                    </li>
                                  ))}
                                </>
                              ) : (
                                <div className="py-4 text-center flex flex-col gap-y-2 justify-end">
                                  <h1 className='font-medium text-lg'>No search results</h1>
                                  <p className='text-sm'>Please try another search</p>
                                </div>
                              )}
                            </ul>)
                            }
                          </>
                        )}
                      </div>
                    </div>
                  </SfDrawer>
                </CSSTransition>
              </li>
        </ul>
      </nav>
      <SfButton onClick={open} className='shadow-none hover:shadow-none active:shadow-none !p-0'>
        <Icons.searchIcon className='text-black'/>
      </SfButton>
    </form>
  );
}