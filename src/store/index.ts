import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import toastReducer from './toastSlice';
import loaderReducer from './loaderSlice';
import transitionReducer from './transitionSlice';



export const store = configureStore({
  reducer: { auth: authReducer, toast: toastReducer, loader: loaderReducer, transition: transitionReducer },
});

// No TypeScript types needed in JS
