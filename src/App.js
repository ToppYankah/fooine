import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import HomePage from "./pages/homepage";
import AddProdPage from "./pages/addprod";
import { useProducts } from "./providers/productProvider";
import { useToken } from "./hooks/token";
import { useWatchlist } from "./providers/watchlistProvider";
import { useAuth } from "./providers/authProvider";
import Loader from "./components/simple_loader";

function App() {
  const {fetchProducts, loading: productsLoading} = useProducts()
  const {user, isAuth, loading: authLoading} = useAuth();
  const [token] = useToken();
  const {getWatchlist} = useWatchlist();

  useEffect(() => {
      fetchProducts();
      getWatchlist(isAuth ? user.id : token);
  }, [isAuth]);

  return (
    <div className="App">
      {productsLoading  ? <Loader expand={true} /> :
      <Router>
        <Switch>
          <Route path="/addProduct">
            <AddProdPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
    </Router>}
    </div>
  );
}

export default App;
