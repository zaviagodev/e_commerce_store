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
import { handleClick } from '../utils/helper';

export default function SelectDropdownPreselected({options, dropdowndame, submenu}) {
  const { close, toggle, isOpen } = useDisclosure({ initialValue: false });
  const id = useId();
  const listboxId = useId();
  const selectTriggerRef = useRef(null);
  const navigate = useNavigate();
  const { refs, style: dropdownStyle } = useDropdown({ isOpen, onClose: close });
  const submenuStyle = {
    position:"absolute",
    top:"-16px",
    left:"calc(100% + 16px)"
  }

  useTrapFocus(refs.floating, {
    arrowKeysUpDown: true,
    activeState: isOpen,
    initialFocus: InitialFocusType.autofocus,
    initialFocusContainerFallback: true,
  });


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
          className={classNames("flex gap-2 justify-between items-center relative px-3 py-2 cursor-pointer transparent text-base", {'text-sm text-black w-max !p-2': !submenu})}
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
          className={classNames('w-[250px] flex flex-col gap-y-[6px] p-4 rounded-md shadow-main border border-neutral-100 bg-white z-10', {hidden: !isOpen})}
          style={submenu ? submenuStyle : dropdownStyle}
        >
          {options.map((option) => (
            <SfListItem
              id={`${listboxId}-${option.label}`}
              key={option.label}
              role="option"
              tabIndex={0}
              className={`${option.children.length > 0 ? 'p-[0!important]' : 'block !px-3'} text-maingray !bg-transparent hover:text-black text-base`}
              onClick={() => handleClick(option.url, option.open_in_new_tab === 1, navigate)}
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