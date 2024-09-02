import React, { FC } from "react";
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionProps } from 'react-transition-group/CSSTransition'

type AnimationName = 'zoom-in-top' | 'zoom-in-bottom' | 'zoom-in-left' | 'zoom-in-right'

interface TransitionProps {
    animation?: AnimationName
}
const Transition:FC<CSSTransitionProps & TransitionProps> = (props) => {
    const { animation, children, classNames, ...restProps } = props
    return (
        <CSSTransition 
        classNames={classNames || animation}
        appear
        unmountOnExit
        {...restProps}
        >
            {children}
        </CSSTransition>
    )
}

export default Transition