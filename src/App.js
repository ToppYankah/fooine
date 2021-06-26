import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import HomePage from "./pages/homepage";
import ProductsProvider from './providers/productProvider.js';
import AuthProvider from './providers/authProvider';
import CartProvider from './providers/cartProvider';

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <div className="App">
            <Router>
              <Switch>
                <Route path="/">
                  <HomePage />
                </Route>
              </Switch>
          </Router>
          </div>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
