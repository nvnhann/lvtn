import {useEffect, useState} from 'react';
// material
import {Container, styled} from '@material-ui/core';

// routes
// utils
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {API_BASE_URL} from "../../config/configUrl";
import ProductList from "../../components/product/ProductList";
import {getData} from "../../_helper/httpProvider";


// ----------------------------------------------------------------------
const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));
// ----------------------------------------------------------------------

export default function ShopProduct() {
    const {themeStretch} = useSettings();
    const [load, setLoad] = useState(true);
    const [products, setProducts] = useState([])
    useEffect(() => {
        (async () => {
            const _products = await getData(API_BASE_URL + '/api/books?pageURL=1');
            setProducts(_products.data);
            setLoad(false);
        })()
    }, [load]);


    return (
        <RootStyle title="Ecommerce: Shop | Minimal-UI">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <ProductList products={products} isLoad={load}/>
            </Container>
        </RootStyle>
    );
}
