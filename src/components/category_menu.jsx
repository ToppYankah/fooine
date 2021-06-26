import React, { useEffect, useState } from 'react';

const CategoryMenu = ({categories, onChange}) => {
    const [selectedId, setSelectedId] = useState('');
    useEffect(() => {
        const menuScrollView = document.getElementById('scroll-menu');
        let Menupos = { top: 0, left: 0, x: 0, y: 0 };

        
        const mouseDownHandler = function(e) {
            menuScrollView.style.cursor = 'grabbing';
            menuScrollView.style.userSelect = 'none';
            Menupos = {
                // The current scroll 
                left: menuScrollView.scrollLeft,
                top: menuScrollView.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };

            menuScrollView.addEventListener('mousemove', mouseMoveHandler);
            menuScrollView.addEventListener('mouseup', mouseUpHandler);
        };
        menuScrollView.addEventListener('mousedown', mouseDownHandler);

        const mouseMoveHandler = function(e) {
            // How far the mouse has been moved
            const dx = e.clientX - Menupos.x;
            const dy = e.clientY - Menupos.y;

            // Scroll the element
            menuScrollView.scrollTop = Menupos.top - dy;
            menuScrollView.scrollLeft = Menupos.left - dx;
        };

        const mouseUpHandler = function() {
            menuScrollView.style.cursor = 'grab';
            menuScrollView.style.removeProperty('user-select');
            menuScrollView.removeEventListener('mousemove', mouseMoveHandler);
        };
    }, []);

    const selectCategory = (categoryId)=>{
        onChange(categoryId)
        setSelectedId(categoryId);
    }

    return (
        <div className='category-menu' id='scroll-menu'>
            <div onClick={()=>selectCategory('')} 
                 className={`item ${selectedId==='' ? 'select' : ''}`}>
                <pre>All</pre>
            </div>
            {categories.map((category, id)=>{ 
                return (
            <div key={id} onClick={()=>selectCategory(category.id)} 
            className={`item ${selectedId===category.id ? 'select' : ''}`}
            >
                <pre>{category.name}</pre>
                </div>
                )}
            )}

            <style jsx="true">{`
                .category-menu{
                    padding: 10px 5%;
                    overflow-x: auto;
                    display: flex;
                    align-items: center;
                    border-top: 1px solid f1f1f1;
                    border-bottom: 1px solid f1f1f1;
                }

                .category-menu::-webkit-scrollbar{
                    height: 3px;
                    background: transparent;
                }
                .category-menu::-webkit-scrollbar-thumb{
                    height: 5px;
                    border-radius: 10px;
                    background: #eee;
                }

                .category-menu .item{
                    padding: 15px;
                    border-radius: 15px;
                    color: var(--text-color);
                    margin-right: 20px;
                    cursor: pointer;
                    display: flex;
                    font-size: 14px;
                    box-shadow: 0 0 10px #eee;
                }

                .category-menu .item.select{
                    color: white;
                    background-color: var(--dark-color);
                }
            `}</style>
        </div>
    );
}

export default CategoryMenu;
