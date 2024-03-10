"use client";
import {AnimatePresence, motion} from "framer-motion";
import s from './PageAnimationLayout.module.scss';
const PageAnimationLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
    return(
        <>
            <motion.div
                initial={{translateY: 100, opacity: 0}}
                animate={{translateY: 0, opacity: 1}}
                transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
            >
                {children}
            </motion.div>
            {/*<motion.div
                className={s.slideIn}
                initial={{scaleY:0}}
                animate={{scaleY: 0}}
                exit={{scaleY: 1}}
                transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
            />*/}

            <motion.div
                className={s.slideOut}
                initial={{scaleY:1}}
                animate={{scaleY: 0}}
                exit={{scaleY: 0}}
                transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
            ></motion.div>
        </>
    )
}
export default PageAnimationLayout;
