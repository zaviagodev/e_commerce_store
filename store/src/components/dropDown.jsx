import { useId, useRef } from 'react';
import classNames from 'classnames';
import {
  SfIconExpandMore,
  SfListItem,
  useDisclosure,
  useDropdown,
  SfIconCheck,
  useTrapFocus,
  InitialFocusType,
} from '@storefront-ui/react';
import { useNavigate } from 'react-router-dom';




export default function SelectDropdownPreselected( {options, dropdowndame}  ) {
  const { close, toggle, isOpen } = useDisclosure({ initialValue: false });
  const id = useId();
  const listboxId = useId();
  const selectTriggerRef = useRef(null);
  const navigate = useNavigate();
  const { refs, style: dropdownStyle } = useDropdown({ isOpen, onClose: close });

  useTrapFocus(refs.floating, {
    arrowKeysUpDown: true,
    activeState: isOpen,
    initialFocus: InitialFocusType.autofocus,
    initialFocusContainerFallback: true,
  });

  function handleClick(url) {
    if(!url) return
    if(!url.startsWith('/') && !url.startsWith('http'))  window.location.href = `https://${url}`;
    if(url.startsWith('http')) window.location.href = url;
    else navigate(url);
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key === ' ') toggle();
  };

  const handleOptionItemKeyDown = (event, option) => {
    if (event.key === ' ' || event.key === 'Enter') selectOption(option);
  };

  return (
    <>
      <div ref={refs.setReference} className="relative">
        <div
          ref={selectTriggerRef}
          id={id}
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label="Select one option"
          className="mt-0.5 flex items-center gap-8 relative font-normal typography-text-base ring-1 ring-neutral-300 ring-inset rounded-md py-2 px-4 hover:ring-primary-700 active:ring-primary-700 active:ring-2 focus:ring-primary-700 focus:ring-2 focus-visible:outline focus-visible:outline-offset cursor-pointer"
          tabIndex={0}
          onKeyDown={handleTriggerKeyDown}
          onClick={toggle}
        >
            {dropdowndame}
          <SfIconExpandMore
            className={classNames('ml-auto text-neutral-500 transition-transform ease-in-out duration-300', {
              'rotate-180': isOpen,
            })}
          />
        </div>
        <ul
          id={listboxId}
          ref={refs.setFloating}
          role="listbox"
          aria-label="Select one option"
          className={classNames('w-full py-2 rounded-md shadow-md border border-neutral-100 bg-white z-10', {
            hidden: !isOpen,
          })}
          style={dropdownStyle}
        >
          {options.map((option) => (
            <SfListItem
              id={`${listboxId}-${option.label}`}
              key={option.label}
              role="option"
              tabIndex={0}
              className={'block'}
              onClick={() => handleClick(option.url)}
              onKeyDown={(event) => handleOptionItemKeyDown(event, option)}
              
            >
            {option.children.length > 0 ?  <SelectDropdownPreselected options={option.children} dropdowndame={option.label} />  : option.label }
              
            </SfListItem>
          ))}
        </ul>
      </div>
    </>
  );
}

