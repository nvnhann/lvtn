import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    Stack,
    styled,
    Typography
} from "@material-ui/core";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import ProductDetailsCarousel from "../../components/product/ProductDetailsCarousel";
import Page from "../../components/Page";
import ProductDetailsSumary from "../../components/product/ProductDetailsSumary";
import {Rating} from "@material-ui/lab";
import {fShortenNumber, randomIntFromInterval} from "../../_helper/helper";
import {fDate} from "../../utils/formatTime";


//----------------------------------------------------------------------------------------
const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));

const GridStyle = styled(Grid)(({theme}) => ({
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:nth-of-type(2)': {
        [theme.breakpoints.up('md')]: {
            borderLeft: `solid 1px ${theme.palette.divider}`,
            borderRight: `solid 1px ${theme.palette.divider}`
        }
    }
}));
//----------------------------------------------------------------------------------------
export default function ProductDetail() {
    const {id} = useParams();

    const [product, setProduct] = useState({});
    const [comment, setComment] = useState([]);
    const [pageURL, setPageURL] = useState(1);
    const [star, setStar] = useState(0)

    const totalRating = comment?.rating?.length > 0 ? comment.rating.reduce((count, item) => count + item.rate * item.num, 0) / comment.rating.reduce((count, item) => count + item.num, 0) : 0;

    useEffect(() => {
        (async () => {
            const _product = await getData(API_BASE_URL + `/api/books/${id}`);
            const _comment = await getData(API_BASE_URL + `/binhluan/${id}?pageURL=${pageURL}&&star=${star}`);
            setProduct(_product.data[0]);
            setComment(_comment.data);
        })()
    }, [id, pageURL, star]);

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
                <Card sx={{p: 5, my: 2}}>
                    <Typography variant='h3' align='center'>M?? t???</Typography>
                    <div dangerouslySetInnerHTML={{__html: product.sp_mota}}/>
                </Card>

                <Card>
                    <Grid container>
                        <GridStyle item xs={12} md={4}>
                            <Typography variant="subtitle1" gutterBottom>
                                ????nh gi??
                            </Typography>
                            <Typography variant="h2" gutterBottom sx={{color: 'error.main'}}>
                                {parseFloat(totalRating).toFixed(1)}/5
                            </Typography>
                            <Rating readOnly value={totalRating} precision={0.1}/>
                        </GridStyle>

                        <GridStyle item xs={12} md={8}>
                            <Stack spacing={1.5} sx={{width: 1}}>
                                {comment?.rating?.map((e, idx) => (
                                    <Stack direction="row" alignItems="center" spacing={1.5} key={idx}>
                                        <Button onClick={() => setStar(e.rate)}>
                                            <Rating value={e.rate} readOnly/>

                                        </Button>
                                        <Typography variant="body2"
                                                    sx={{color: 'text.secondary', minWidth: 64, textAlign: 'right'}}>
                                            {fShortenNumber(e.num)} ????nh gi??
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </GridStyle>
                    </Grid>

                    <Divider/>
                    <List disablePadding>
                        {comment?.data?.map((e, idx) => (
                            <ListItem key={idx}>
                                <ListItem
                                    disableGutters
                                    sx={{
                                        mb: 5,
                                        alignItems: 'flex-start',
                                        flexDirection: {xs: 'column', sm: 'row'}
                                    }}
                                >
                                    <Box
                                        sx={{
                                            mr: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: {xs: 2, sm: 0},
                                            minWidth: {xs: 160, md: 240},
                                            textAlign: {sm: 'center'},
                                            flexDirection: {sm: 'column'}
                                        }}
                                    >
                                        <Avatar
                                            src={`/static/avatar_${randomIntFromInterval(1, 20)}.jpg`}
                                            sx={{
                                                mr: {xs: 2, sm: 0},
                                                mb: {sm: 2},
                                                width: {md: 64},
                                                height: {md: 64}
                                            }}
                                        />

                                        <Typography variant="subtitle2" noWrap>
                                            {e.fullname}
                                        </Typography>
                                        <Typography variant="caption" sx={{color: 'text.secondary'}} noWrap>
                                            {fDate(e.bl_thoigian)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Rating size="small" value={e.bl_danhgia} readOnly/>
                                        <Typography variant="body2">{e.bl_noidung}</Typography>

                                    </Box>
                                </ListItem>
                            </ListItem>
                        ))}
                    </List>
                    <Stack direction='row' justifyContent='center' sx={{my: 2}}>
                        <Button onClick={() => setPageURL(e => e + 1)} variant='contained'>Xem th??m</Button>
                    </Stack>
                </Card>
            </Container>
        </RootStyle>
    )
}