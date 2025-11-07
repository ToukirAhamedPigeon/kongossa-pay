import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { startTransition, finishTransition } from '@/store/transitionSlice';

export default function PageTransition({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentPage, transitionDone } = useSelector(
    (state) => state.transition || { currentPage: null, transitionDone: false }
  );

  // ✅ skip first mount in dev mode
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      if (currentPage !== location.pathname) {
        dispatch(startTransition(location.pathname));
      }
    } else {
      hasMounted.current = true; // mark first mount done
    }
  }, [location.pathname, currentPage, dispatch]);

  return (
        <>
            {children}
        </>
  );

//   return (
//         <>
//             {children}
//         </>
//     // <AnimatePresence mode="wait" initial={false}>
//       {/* <motion.div
//         key={location.pathname}
//         initial={transitionDone ? false : { opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.25, ease: 'easeInOut' }}
//         onAnimationComplete={() => dispatch(finishTransition())}
//       > */}
//     //   </motion.div>
//     // </AnimatePresence>
  
//   );
}
