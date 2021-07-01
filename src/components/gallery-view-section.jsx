import React, { useState, useEffect } from 'react';
import { useToken } from '../hooks/token';
import { useAuth } from '../providers/authProvider';
import { useCart } from '../providers/cartProvider';
import { useProducts } from '../providers/productProvider';
import CategoryMenu from './category_menu';

const GalleryViewSection = () => {
    const {products: prods, categories, getProducts } = useProducts();
    const {cart, checkout} = useCart();
    const [token] = useToken();
    const {user, isAuth} = useAuth();
    const [products, setProducts] = useState(prods);
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        setProducts(getProducts(categoryFilter));
    }, [categoryFilter, prods]);

    return (
        <div className="gallery-view">
            <div className="mute-heading">
                <hr /><b>All Products</b><hr />
            </div>
            <CategoryMenu categories={categories} onChange={(categoryId)=> setCategoryFilter(categoryId)} />
            <div className="inner">
                <div className="category-section">
                    <div className="mute-heading">
                        <hr /><b>Filter By</b><hr />
                    </div>
                    <button className="cat-item">Added Today</button>
                    <button className="cat-item">Sold/Old Products</button>
                    <button className="cat-item">On Hold</button>
                    <button className="cat-item">Recently Added</button>
                </div>
                <section className="product-section">
                    {products.map(product=> <div className="item">
                        <img draggable="false" src={product.imageUrl} alt="product item" />
                        <div className="content">

                        </div>
                    </div>)}
                </section>
            </div>
            <style jsx>{`
                .gallery-view{
                    padding-bottom: 60px;
                    min-height: 100%;
                    width: 100%;
                }

                .gallery-view .inner{
                    display: flex;
                    width: 100%;
                    padding: 20px 5%;
                }

                .gallery-view .inner .category-section{
                    padding: 20px 2%;
                    min-width: 300px;
                    margin-right: 5%;
                    box-shadow: 0 0 20px #efefef;
                    border-radius: 20px;
                    align-self: start;
                    display: flex;
                    flex-direction: column;
                }

                .gallery-view .inner .category-section > button{
                    margin-top: 10px;
                    padding: 15px;
                    border-radius: 10px;
                    border:none;
                    text-align: left;
                    cursor: pointer;
                    background: #fafafa;
                }

                .gallery-view .inner section{
                    display: grid;
                    grid-template-columns: repeat(3, 33.33%);
                    grid-gap: 2%;
                }

                .gallery-view .inner .item{
                    min-width: 100%;
                    min-height: 300px;
                }

                .gallery-view .item img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 10px;
                }

                .gallery-view .inner .item .content{
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #0000009a;
                    border-radius: 10px;
                    opacity: 0;
                    transition: opacity .1s linear;
                }
                .gallery-view .inner .item:hover .content{
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}

export default GalleryViewSection;
