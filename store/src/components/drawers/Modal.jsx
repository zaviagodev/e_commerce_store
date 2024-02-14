import { useRef } from "react";
import { CSSTransition } from 'react-transition-group';
import { SfModal } from "@storefront-ui/react";

export default function Modal({children, isOpen, close, open}){
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    return (
        <>
        <CSSTransition
            in={isOpen}
            nodeRef={backdropRef}
            timeout={200}
            unmountOnExit
            classNames={{
            enter: 'opacity-0',
            enterDone: 'opacity-100 transition duration-200 ease-out',
            exitActive: 'opacity-0 transition duration-200 ease-out',
            }}
        >
            <div ref={backdropRef} className="fixed inset-0 bg-neutral-700 bg-opacity-50 z-[100]" />
        </CSSTransition>
        <CSSTransition
            in={isOpen}
            nodeRef={modalRef}
            timeout={200}
            unmountOnExit
            classNames={{
            enter: 'translate-y-10 opacity-0',
            enterDone: 'translate-y-0 opacity-100 transition duration-200 ease-out',
            exitActive: 'translate-y-10 opacity-0 transition duration-200 ease-out',
            }}
        >
            <SfModal
                open={open}
                onClose={close}
                ref={modalRef}
                as="section"
                role="alertdialog"
                className="max-w-[90%] md:max-w-[456px] w-full z-[100] flex flex-col gap-y-8 items-center text-center !p-8"
            >
                {children}
            </SfModal>
        </CSSTransition>
        </>
    )
}