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
  SfIconChevronRight,
} from '@storefront-ui/react';
import { useNavigate } from 'react-router-dom';

export default function SelectDropdownPreselected({options, dropdowndame, submenu}) {
  const { close, toggle, isOpen } = useDisclosure({ initialValue: false });
  const id = useId();
  const listboxId = useId();
  const selectTriggerRef = useRef(null);
  const navigate = useNavigate();
  const { refs, style: dropdownStyle } = useDropdown({ isOpen, onClose: close });
  const submenuStyle = {
    position:"absolute",
    top:"0%",
    left:"100%"
  }

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
      <div ref={refs.setReference} className="hidden lg:block relative">
        <div
          ref={selectTriggerRef}
          id={id}
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label="Select one option"
          className={classNames("flex gap-2 justify-between items-center relative font-normal typography-text-base cursor-pointer px-4 py-2 transparent", {'text-white w-max': !submenu})}
          tabIndex={0}
          onKeyDown={handleTriggerKeyDown}
          onClick={toggle}
        >
            {dropdowndame}
          {submenu ? <SfIconChevronRight /> : <SfIconExpandMore className={classNames('ml-auto transition-transform ease-in-out duration-300', {'rotate-180': isOpen})}/>}
        </div>
        <ul
          id={listboxId}
          ref={refs.setFloating}
          role="listbox"
          aria-label="Select one option"
          className={classNames('w-full py-2 rounded-md shadow-md border border-neutral-100 bg-white z-10', {hidden: !isOpen})}
          style={submenu ? submenuStyle : dropdownStyle}
        >
          {options.map((option) => (
            <SfListItem
              id={`${listboxId}-${option.label}`}
              key={option.label}
              role="option"
              tabIndex={0}
              className={option.children.length > 0 ? 'p-[0!important]' : 'block'}
              onClick={() => handleClick(option.url)}
              onKeyDown={(event) => handleOptionItemKeyDown(event, option)}
            >
              {option.children.length > 0 ?  <SelectDropdownPreselected submenu={true} options={option.children} dropdowndame={option.label} />  : option.label }
            </SfListItem>
          ))}
        </ul>
      </div>
    </>
  );
}

