import React, { useEffect, useState } from 'react';
import CategoryMenu from '../components/category_menu';
import LiveFeedSection from '../components/feed_section';
import HomeHeader from '../components/home_header';
import LoginForm from '../components/login_form';
import { useProducts } from '../providers/productProvider';
import { Route, useHistory } from "react-router-dom";
import SignupForm from '../components/signup_form';
import CartCheckoutPopup from '../components/cart-checkout-popup';
import ProductViewPage from '../components/product_view_page';
import ProfilePopup from '../components/profile_popup';
import QuickCartView from '../components/quick_cart_view';
import GalleryViewSection from '../components/gallery-view-section';
import '../css/home.css';

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

    return (
        <div id='homepage'>
            <>
                <HomeHeader onSearch={handleSearch} />
                <div className="page-body">
                    <LiveFeedSection products={products} />
                    <GalleryViewSection />
                </div>
                <QuickCartView />
                <Route path="/login">
                    <LoginForm />
                </Route>
                <Route path="/signup">
                    <SignupForm />
                </Route>
                <Route path="/cart">
                    <CartCheckoutPopup />
                </Route>
                <Route path="/profile">
                    <ProfilePopup />
                </Route>
                <Route path="/preview-product/:id">
                    <ProductViewPage />
                </Route>
            </>
        </div>
    );
}

export default HomePage;
