import {useEffect, useState} from 'react';
// material
import {Box, Button, Container, styled, Typography} from '@material-ui/core';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {API_BASE_URL} from "../../config/configUrl";
import ProductList from "../../components/product/ProductList";
import {getData} from "../../_helper/httpProvider";
import { Pages } from '@material-ui/icons';

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
    const [products, setProducts] = useState([]);
    const [products1, setProducts1] = useState([]);
    const [products2, setProducts2] = useState([]);
    const [page, setPage] = useState(1);
    useEffect(() => {
        (async () => {
            const _products = await getData(API_BASE_URL + `/sachbanchay`);
            const _products1 = await getData(API_BASE_URL + `/sachmoinhat`);
            const _products2 = await getData(API_BASE_URL + `/api/books?pageURL=${page}`);
            setProducts(_products.data);
            setProducts1(_products1.data);
            setProducts2(_products2.data);
            setLoad(false);
        })()
    }, [load, page]);


    return (
        <RootStyle title="HYBE">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Typography>San pham ban chay</Typography>
                <ProductList products={products} isLoad={load}/>
                <Typography>San pham moi nhat</Typography>
                <ProductList products={products1} isLoad={load}/>
                <Typography>Tat ca san pham</Typography>
                <ProductList products={products2} isLoad={load}/>
                <Box mt={4} display='flex' justifyContent='center'>
                    <Button variant='contained' onClick={() => setPage(e => e + 1)}>Xem thêm</Button>
                </Box>
            </Container>
        </RootStyle>
    );
}
