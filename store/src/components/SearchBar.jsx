import { useState, useRef } from 'react';
import { useDebounce } from 'react-use';
import { offset } from '@floating-ui/react-dom';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
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
} from '@storefront-ui/react';




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
  const handleSubmit = (event) => {
    event.preventDefault();
    close();
    alert(`Search for phrase: ${searchValue}`);
  };

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
      handleReset();
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
    <form role="search" onSubmit={handleSubmit} ref={refs.setReference} className={className}>
      <div className="flex flex-1">
        <SfInput
          ref={inputRef}
          value={searchValue}
          onChange={handleChange}
          onFocus={open}
          wrapperClassName="w-full !ring-0 active:!ring-0 hover:!ring-0 focus-within:!ring-0 border-y border-l border-neutral-200 rounded-r-none hover:border-primary-800 active:border-primary-700 active:border-y-2 active:border-l-2 focus-within:border-y-2 focus-within:border-l-2 focus-within:border-primary-700"
          aria-label="Search"
          placeholder="Search 'MacBook' or 'iPhone'..."
          onKeyDown={handleInputKeyDown}
          slotPrefix={<SfIconSearch />}
          slotSuffix={
            isResetButton && (
              <button
                type="reset"
                onClick={handleReset}
                aria-label="Reset search"
                className="flex rounded-md focus-visible:outline focus-visible:outline-offset"
              >
                <SfIconCancel />
              </button>
            )
          }
        />
        <SfButton type="submit" square aria-label="Search for a specific phrase on the page" className="rounded-l-none">
          <SfIconSearch />
        </SfButton>
      </div>
      {isOpen && (
        <div ref={refs.setFloating} style={style} className="left-0 right-0">
          {isLoadingSnippets ? (
            <div className="flex items-center justify-center bg-white w-full h-screen sm:h-20 py-2 sm:border sm:border-solid sm:rounded-md sm:border-neutral-100 sm:drop-shadow-md">
              <SfLoaderCircular />
            </div>
          ) : (
            snippets.length > 0 && (
              <ul
                ref={dropdownListRef}
                className="py-2 bg-white h-screen sm:h-auto sm:border sm:border-solid sm:rounded-md sm:border-neutral-100 sm:drop-shadow-md"
              >
                {snippets.map(({ highlight, rest, product }) => (
                  <li key={product.name}>
                    <SfListItem
                      as="button"
                      type="button"
                      onClick={handleSelect(product)}
                      className="!py-4 sm:!py-2 flex justify-start"
                    >
                      <p className="text-left">
                        <span>{highlight}</span>
                        <span className="font-medium">{rest}</span>
                      </p>
                      <p className="text-left typography-text-xs text-neutral-500">{product.item_group}</p>
                    </SfListItem>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </form>
  );
}
