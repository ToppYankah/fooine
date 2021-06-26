import axios from 'axios';
import React, { useState, useContext } from 'react';
import api from '../api';

const ProductsContext = React.createContext();

export function useProducts() {
    return useContext(ProductsContext);
}

//////////// NEXT STEP ///////////////
// Create products for test

function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (token)=>{
        // make api call to fetch products from db
        const result = api.fetchProducts(token);
        if(result.success){
            const {data} = result;
            setProducts(data.products.map(item=> item));
        }else{
            console.log(result);
        }

        const cat_result = api.fetchCategories(token);
        if(cat_result.success){
            const {data} = cat_result;
            setCategories(data.categories.map(item=> item));
        }else{
            console.log(result)
        }
    }

    const searchProducts = (searchString)=>{
        if(searchString && searchString !== ""){
            return products.filter(product=>
                product.name.toLowerCase().includes(searchString.toLowerCase()) || 
                product.category.toLowerCase().includes(searchString.toLowerCase())
            );
        }
        return products.map(item=> item);
    }

    const getProducts = (category = "") => {
        if(category === ""){
            return products.map(item=> item);
        }
        return products.filter(product=> product.category === category);
    }

    const getCategories = () => {}

    const holdProduct = (productId, userId) => {
        if(productId !== null || productId !== ""){
            const newProducts = products;
            const foundProduct = newProducts.filter(product=> product.id === productId)[0];
            const index = newProducts.indexOf(foundProduct);
            foundProduct.heldBy = userId;
            newProducts[index] = foundProduct;
            setProducts(newProducts.map(item=> item));
        }
    }

     const unholdProduct = (productId) => {
        if(productId !== null || productId !== ""){
            const newProducts = products;
            const foundProduct = newProducts.filter(product=> product.id === productId)[0];
            const index = newProducts.indexOf(foundProduct);
            foundProduct.heldBy = "";
            newProducts[index] = foundProduct;
            setProducts(newProducts.map(item=> item));
        }
    }

    const markProductsAsSold = (checkoutProducts)=>{
        if(checkoutProducts.length > 0 && checkoutProducts !== null){
            const productIds = checkoutProducts.map(item=> item.id);
            const modifiedProducts = [];

            products.forEach(product=> {
                if(productIds.includes(product.id)){
                    product.status = "Sold";
                    modifiedProducts.push(product);
                }else{
                    modifiedProducts.push(product);
                }
            });

            setProducts(modifiedProducts.map(product=> product));
        }
    }

    const like = (userID, productID, reverse=false)=>{
        setLoading(true);
        api.likeProduct(userID, productID);
        const modifiedProducts = products;
        
        if(userID && productID && !reverse){
            const foundProduct = modifiedProducts.filter(product=> product.id === productID)[0];
            const productIndex = modifiedProducts.indexOf(foundProduct);
            foundProduct.likes.push(userID);
            modifiedProducts[productIndex] = foundProduct;
            setProducts(modifiedProducts.map(item=> item));
            setLoading(false);
            return true;
        }
        if(userID && productID && reverse){
            const foundProduct = modifiedProducts.filter(product=> product.id === productID)[0];
            const productIndex = modifiedProducts.indexOf(foundProduct);
            foundProduct.likes = foundProduct.likes.filter(id=> id !== userID);
            modifiedProducts[productIndex] = foundProduct;
            setProducts(modifiedProducts.map(item=> item));
            setLoading(false);
            return true;
        }
        setLoading(false);
        return false;
    }
 
    const addToWishList = ()=>{

    }

    const share = ()=>{

    }
    
    return (
        <ProductsContext.Provider value={{
            products, categories,
            fetchProducts, getProducts, getCategories, holdProduct, 
            unholdProduct, markProductsAsSold, searchProducts,
            like, addToWishList, share, loading
        }}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider;
