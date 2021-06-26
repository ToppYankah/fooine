import React, { useEffect, useState } from 'react';
import CategoryMenu from '../components/category_menu';
import FeedSection from '../components/feed_section';
import HomeHeader from '../components/home_header';
import LoginForm from '../components/login_form';
import { useProducts } from '../providers/productProvider';
import { Route, useHistory } from "react-router-dom";
import SignupForm from '../components/signup_form';
import CartCheckoutPopup from '../components/cart-checkout-popup';
import ProductViewPage from '../components/product_view_page';
import Loader from '../components/simple_loader';
import useAuthentication from '../hooks/auth';
import ProfilePopup from '../components/profile_popup';
import { useCart } from '../providers/cartProvider';
import { useAuth } from '../providers/authProvider';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const { products: _prods, getProducts, categories, fetchProducts, searchProducts} = useProducts();
    const {getCart} = useCart();
    const [categoryFilter, setCategoryFilter] = useState("");
    const [token, loading] = useAuthentication();
    const {user} = useAuth();
    const history = useHistory();

    useEffect(() => {
        fetchProducts();
        getCart(user.id ? user.id : token);
    }, [user]);

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
            { loading ? <Loader expand={true} /> : 
                <>
                    <HomeHeader onSearch={handleSearch} />
                    <CategoryMenu categories={categories} onChange={(categoryId)=> setCategoryFilter(categoryId)} />
                    <FeedSection products={products} />
                    <Route path="/preview-product/:id">
                        <ProductViewPage />
                    </Route>
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
                </>
            }
        </div>
    );
}

export default HomePage;
