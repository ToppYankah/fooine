import React, { useEffect, useState } from 'react';
import LiveFeedSection from '../components/feed_section';
import HomeHeader from '../components/home_header';
import LoginForm from '../components/login_form';
import { useProducts } from '../providers/productProvider';
import { Route, useHistory } from "react-router-dom";
import SignupForm from '../components/signup_form';
import CheckoutPopup from '../components/cart-checkout-popup';
import ProductViewPage from '../components/product_view_page';
import ProfilePopup from '../components/profile_popup';
import QuickWatchlistView from '../components/quick_watchlist_view';
import GalleryViewSection from '../components/gallery-view-section';
import '../css/home.css';
import DesktopNotifications from '../components/notifications';
import ErrorPopup from '../components/error-popup';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const { products: _prods, getProducts, searchProducts} = useProducts();
    const [categoryFilter, setCategoryFilter] = useState("");
    const history = useHistory();

    useEffect(() => {
        setProducts(getProducts(categoryFilter));
    }, [categoryFilter, _prods]);

    const handleSearch = (string)=>{
        (string.length > 0) ?
        setProducts(searchProducts(string)) :
        setProducts(getProducts(categoryFilter));
    }

    history.listen(()=>{
        document.body.style.overflow = "auto";     
    });

    const reversedProducts = ()=> products.reverse().map(item=> item);

    return (
        <div id='homepage'>
            <>
                <HomeHeader onSearch={handleSearch} />
                <div className="page-body">
                    <LiveFeedSection products={reversedProducts()} />
                    <GalleryViewSection />
                </div>
                <QuickWatchlistView />
                <DesktopNotifications />
                <Route path="/login">
                    <LoginForm />
                </Route>
                <Route path="/signup">
                    <SignupForm />
                </Route>
                <Route path="/watchlist">
                    <CheckoutPopup />
                </Route>
                <Route path="/profile">
                    <ProfilePopup />
                </Route>
                <Route path="/preview-product/:id">
                    <ProductViewPage />
                </Route>
                <ErrorPopup />
            </>
        </div>
    );
}

export default HomePage;
