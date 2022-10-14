import {Card, Container, Grid, styled, Typography} from "@material-ui/core";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import ProductDetailsCarousel from "../../components/product/ProductDetailsCarousel";
import Page from "../../components/Page";
import ProductDetailsSumary from "../../components/product/ProductDetailsSumary";


//----------------------------------------------------------------------------------------
const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));
//----------------------------------------------------------------------------------------
export default function ProductDetail() {
    const {id} = useParams();
    const [product, setProduct] = useState({});

    useEffect(() => {
        (async () => {
            const _product = await getData(API_BASE_URL + `/api/books/${id}`);
            setProduct(_product.data[0]);
            console.log(_product.data)
        })()
    }, [id]);
    return (
        <RootStyle>
            <Container>
                {product.sp_hinhanh && (
                    <Card>
                        <Grid container>
                            <Grid item xs={12} md={6} lg={7}>
                                <ProductDetailsCarousel images={product?.sp_hinhanh}/>
                            </Grid>
                            <Grid item xs={12} md={6} lg={5}>
                                <ProductDetailsSumary product={product}/>
                            </Grid>
                        </Grid>
                    </Card>
                )}
                <Card sx={{p: 5, mt: 2}}>
                    <Typography variant='h3' align='center'>Mô tả</Typography>
                    <div dangerouslySetInnerHTML={{__html: product.sp_mota}}/>
                </Card>
            </Container>
        </RootStyle>
    )
}