import { useRef } from "react";
import { SfDrawer } from "@storefront-ui/react";
import { CSSTransition } from 'react-transition-group';
import { Icons } from '../icons';

export default function AddressDrawer({isOpen, setIsOpen, children, title}){
    const nodeRef = useRef(null);
    const drawerRef = useRef(null);
    return (
        <CSSTransition
            ref={nodeRef}
            in={isOpen}
            timeout={200}
            unmountOnExit
            classNames={{
                enter: 'opacity-0',
                enterActive: 'opacity-1',
                enterDone: 'opacity-1 transition duration-200 ease-in-out',
                exitDone: 'opacity-1',
                exitActive: 'opacity-0 transition duration-200 ease-in-out',
            }}
        >
            <SfDrawer
                ref={drawerRef}
                placement='right'
                open
                onClose={() => setIsOpen(false)}
                className="bg-neutral-50 z-99 md:w-[386px] w-full box-border"
            >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex items-center gap-x-[10px] p-4 border-b">
                            <div className="flex h-7 items-center">
                                <button onClick={() => setIsOpen(false)} type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Close panel</span>
                                    <Icons.flipBackward />
                                </button>
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 text-center whitespace-pre" id="slide-over-title">{title}</h2>
                        </div>
                        <div className="flow-root p-6 mb-24">
                            {children}
                        </div>
                    </div>
                </div>
            </SfDrawer>
        </CSSTransition>
    );
}