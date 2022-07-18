import { useEffect } from "react";
import { useDispatch } from 'react-redux'
import { initCategories } from "../../stores/category";
import { init } from "../../stores/site";
import { useSelector } from 'react-redux'
import { initProducts } from "../../stores/product";

export default function Splash() {
    const dispatch = useDispatch();

    const isCategoryInited = useSelector((state) => state.category.isInitialized);
    const isProductsInited = useSelector((state) => state.product.isInitialized);
    const inited = useSelector((state) => state.site.isInitialized);

    useEffect(() => {
        if (!isCategoryInited) {
            dispatch(initCategories());
        }
        if (!isProductsInited) {
            dispatch(initProducts());
        }
        if (isCategoryInited && isProductsInited) {
            dispatch(init());
        }
        return () => {
            console.log('Splash Destroyed');
        }
    }, [dispatch, isCategoryInited, isProductsInited, inited]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Loading....
        </div>
    )
}