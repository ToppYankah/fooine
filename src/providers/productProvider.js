// import axios from 'axios';
import React, { useState, useContext } from 'react';
import api from '../api';
import firebase from '../firebase';
import { useError } from './errorProvider';

const ProductsContext = React.createContext();

export function useProducts() {
    return useContext(ProductsContext);
}

//////////// NEXT STEP ///////////////
// Create products for test

export const getStatus = (status)=>{
    let output;
    switch (status) {
        case 0:
            output = {value: "Available", color: "orange"}
            break;
        case 1:
            output = {value: "On Hold", color: "grey"}
            break;
        case 2:
            output = {value: "Sold", color: "red"}
            break;
    
        default:
            output = {value: "In Stock", color: "orange"}
            break;
    }
    return output;
}


function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(false);
    const {error, createError} = useError();

    const productsRef = firebase.firestore().collection('products');
    const catsRef = firebase.firestore().collection('categories');

    const fetchProducts = async ()=>{
        setLoading(true);
        // make api call to fetch products from db
        catsRef.get().then(item=>{
            setCategories(item.docs.map(doc=> doc.data()) || []);
        }).catch(err=>{
            console.log(err);
        })

        productsRef.onSnapshot(snapshot=>{
            setProducts(snapshot.docs.map(doc=> doc.data()) || []);
            setLoading(false);
            snapshot.docChanges(item=>{
                console.log("products modified", item.data());
                setProducts(item.docs.map(doc=> doc.data()) || []);
            });
        });       
    }

    const getProductById = (id)=>{
        return products.filter(product=> product.id === id)[0];
    }

    const fetchProductById = async (id)=>{
        setLoading(true);
        const prodSnapshot = await productsRef.doc(id).get();
        return prodSnapshot.data();
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

    const holdProduct = (userId, product) => {
        if(product && userId){
            if(product.heldBy !== ""){
                let update = {};
                update = {heldBy: userId, status: 1}
                productsRef.doc(product.id).update(update)
                .then(_=>{
                    const newProducts = products;
                    const index = newProducts.indexOf(product);
                    product = {...product, ...update};
                    newProducts[index] = product;
                    setProducts(newProducts.map(item=> item));
                }).catch(error=>{
                    createError(error.message, 2000);
                })
            }else{
                createError("Item has already been held!", 3000);
            }            
        }
    }

     const unholdProduct = (userId, product) => {
        if(userId && product){
            let update = {};
            update = {heldBy: "", status: 0}
            productsRef.doc(product.id).update(update)
            .then(_=>{
                const newProducts = products;
                const index = newProducts.indexOf(product);
                product = {...product, ...update};
                newProducts[index] = product;
                setProducts(newProducts.map(item=> item));
            }).catch(error=>{
                createError(error.message);
            })
        }
    }

    const markProductsAsSold = (checkoutProducts)=>{
        if(checkoutProducts.length > 0 && checkoutProducts !== null){
            const productIds = checkoutProducts.map(item=> item.id);
            productIds.forEach(id => {
                productsRef.doc(id).update({status: 2}).catch(error=> console.log(error));
            });
            
            const modifiedProducts = [];
            products.forEach(product=> {
                if(productIds.includes(product.id)){
                    product.status = 2;
                    modifiedProducts.push(product);
                }else{
                    modifiedProducts.push(product);
                }
            });

            setProducts(modifiedProducts.map(product=> product));
        }
    }

    const like = (userId, product)=>{
        let output = false;
        let update = {};
        if(product.likes.includes(userId)){
            update = {likes: [...product.likes.filter(id=> id !== userId)]}
        }else{
            update = {likes: [...product.likes, userId]}
        }
        productsRef.doc(product.id).update(update)
        .then(docref=>{
            const newProducts = products;
            const index = newProducts.indexOf(product);
            product.likes = update.likes;
            newProducts[index] = product;
            setProducts(newProducts.map(item=> item));
            output = true;
        }).catch(error=>{
            console.log(error);
        })
        return output;
    }
 
    const addToWishList = (userId, product)=>{
        let output = false;
        let update = {};
        if(product.wishlist.includes(userId)){
            update = {wishlist: [...product.wishlist.filter(id=> id !== userId)]}
        }else{
            update = {wishlist: [...product.wishlist, userId]}
        }
        productsRef.doc(product.id).update(update)
        .then(docref=>{
            const newProducts = products;
            const index = newProducts.indexOf(product);
            product.wishlist = update.wishlist;
            newProducts[index] = product;
            setProducts(newProducts.map(item=> item));
            output = true;
        }).catch(error=>{
            console.log(error);
        })
        return output;
    }

    const share = ()=>{

    }

    const comment = (by, message, product)=>{
        const update = {comments: [{by, comment: message}, ...product.comments]};

        productsRef.doc(product.id).update(update)
        .then(docRef=>{
            const newProducts = products;
            const updatedProduct = product;
            updatedProduct.comments = update.comments;
            const index = products.indexOf(product);
            newProducts[index] = updatedProduct;
            setProducts(newProducts.map(item=> item));
        })
        .catch(error=>{
            console.log(error)
        })
    }
    
    return (
        <ProductsContext.Provider value={{
            products, categories, loading,
            fetchProducts, getProducts, holdProduct, fetchProductById, 
            unholdProduct, markProductsAsSold, searchProducts,
            like, addToWishList, share, getProductById, comment
        }}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider;
