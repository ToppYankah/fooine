import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import FirebaseProvider from './firebase/index';
import ProductsProvider from './providers/productProvider';
import AuthProvider from './providers/authProvider';
import CartProvider from './providers/cartProvider';

ReactDOM.render(
  <React.StrictMode>
    {/* <FirebaseProvider> */}
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
              <App />
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    {/* </FirebaseProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
