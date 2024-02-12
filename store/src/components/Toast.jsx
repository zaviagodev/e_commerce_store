import { useRef } from "react";
import { CSSTransition } from 'react-transition-group';

export default function Toast({children, isOpen}){
    const nodeRef = useRef()
    return (
        <CSSTransition
            ref={nodeRef}
            in={isOpen}
            timeout={500}
            unmountOnExit
            classNames={{
                enter: 'translate-x-[150%]',
                enterActive: 'translate-x-0',
                enterDone: 'translate-x-0 transition duration-500',
                exitDone: 'translate-x-0',
                exitActive: 'translate-x-[150%] transition duration-500',
            }}
        >
            <div
                role="alert"
                className="flex justify-between shadow-toast p-8 w-[400px] rounded-xl absolute bottom-4 right-4"
            >
                {children}
            </div>
        </CSSTransition>
    )
}