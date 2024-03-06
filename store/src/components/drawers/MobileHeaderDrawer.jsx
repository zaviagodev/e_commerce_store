import { useRef } from "react";
import { SfDrawer } from "@storefront-ui/react";
import { CSSTransition } from 'react-transition-group';

export default function MobileHeaderDrawer({isOpen, setIsOpen, children, title}){
    const nodeRef = useRef(null);
    const drawerRef = useRef(null);
    const backdropRef = useRef(null);
    return (
        <>
        <CSSTransition
            in={isOpen}
            nodeRef={backdropRef}
            timeout={300}
            unmountOnExit
            classNames={{
            enter: 'opacity-0',
            enterActive: 'opacity-100 transition duration-300 ease-in-out',
            enterDone: 'opacity-100 transition duration-300 ease-in-out',
            exitDone: 'opacity-0',
            exitActive: 'opacity-0 transition duration-300 ease-in-out',
            }}
        >
            <div ref={backdropRef} className="fixed inset-0 bg-neutral-500 bg-opacity-50 z-60" />
        </CSSTransition>
        <CSSTransition
            ref={nodeRef}
            in={isOpen}
            timeout={300}
            unmountOnExit
            classNames={{
                enter: '-translate-x-full',
                enterActive: 'translate-x-0 transition duration-300 ease-in-out',
                enterDone: 'translate-x-0 transition duration-300 ease-in-out',
                exitDone: 'translate-x-0',
                exitActive: '-translate-x-full transition duration-300 ease-in-out',
            }}
        >
            <SfDrawer
                ref={drawerRef}
                placement='top'
                open
                onClose={() => setIsOpen(false)}
                className="bg-neutral-50 z-99 max-w-[320px] w-full box-border"
            >
                <div className="flex h-full flex-col overflow-y-auto bg-white">
                    <div className="flex-1">
                        {/* <div className="flex items-center gap-x-[10px] p-4 border-b h-[52px]">
                            <div className="flex h-7 items-center">
                                <button onClick={() => setIsOpen(false)} type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Close panel</span>
                                    <Icons.flipBackward />
                                </button>
                            </div>
                            <h2 className="text-base font-medium text-gray-900 text-center whitespace-pre" id="slide-over-title">{title}</h2>
                        </div> */}
                        <div className="flow-root p-6 pb-12 h-screen">
                            {children}
                        </div>
                    </div>
                </div>
            </SfDrawer>
        </CSSTransition>
        </>
    )
}