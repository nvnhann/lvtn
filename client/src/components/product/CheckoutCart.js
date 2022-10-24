import {Icon} from '@iconify/react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {Form, FormikProvider, useFormik} from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import {Button, Card, CardHeader, Grid, Typography} from '@material-ui/core';
// redux
import CheckoutProductList from './CheckoutProductList';
import {useDispatch, useSelector} from "react-redux";
import {checkout, checkoutProduct, onNextStep} from "../../redux/slices/product";
import {cartItemCount, cartItemTotal} from "../../redux/slices/cart";
import Scrollbar from "../Scrollbar";
import EmptyContent from "../EmptyContent";
import {PATH_PAGE} from "../../routes/paths";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../../config/configUrl";
import {postData} from "../../_helper/httpProvider";
import CheckoutSummary from "./CheckoutSummary";

// ----------------------------------------------------------------------

export default function CheckoutCart() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cartItem);
    const totalItems = useSelector(cartItemCount);
    const isEmptyCart = cart.length === 0;
    const isLogined = !!useSelector(state => state.user.current?.id);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const totalPrice = useSelector(cartItemTotal);

    useEffect(() => {
        (async () => {
            if (cart.length === 0) return;
            const _products = await postData(API_BASE_URL + '/shopcart', {cart: cart});
            cart.map((e, idx) => _products.data[idx].sp_soluong = e.so_luong > _products.data[idx].ctpn_soluong ? _products.data[idx].ctpn_soluong : e.so_luong)
            setProducts(_products.data);
        })()
    }, [totalItems, cart]);

    const handleNextStep = () => {
        dispatch(onNextStep());
    };

    const handleApplyDiscount = (value) => {
        console.log(value);
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {products: cart},
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            try {
                setSubmitting(true);
                if (!isLogined) navigate('/auth/login')
                dispatch(checkout({totalPrice: totalPrice, shipping: 30000}));
                dispatch(checkoutProduct(products))
                handleNextStep();
            } catch (error) {
                console.error(error);
                setErrors(error.message);
            }
        }
    });

    const {handleSubmit} = formik;
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={9}>
                        <Card sx={{mb: 3}}>
                            <CardHeader
                                title={
                                    <Typography variant="h6">
                                        Giỏ hàng
                                        <Typography component="span" sx={{color: 'text.secondary'}}>
                                            &nbsp;({totalItems} sản phẩm)
                                        </Typography>
                                    </Typography>
                                }
                                sx={{mb: 3}}
                            />

                            {!isEmptyCart ? (
                                <Scrollbar>
                                    <CheckoutProductList
                                        products={products}
                                    />
                                </Scrollbar>
                            ) : (
                                <EmptyContent
                                    title="Giỏ hàng trống"
                                    img="/static/illustrations/illustration_empty_cart.svg"
                                />
                            )}
                        </Card>

                        <Button
                            color="inherit"
                            component={RouterLink}
                            to={PATH_PAGE.shopcart}
                            startIcon={<Icon icon={arrowIosBackFill}/>}
                        >
                            Tiếp tục xem sách
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CheckoutSummary
                            total={totalPrice + 30000}
                            enableDiscount
                            subtotal={totalPrice}
                            onApplyDiscount={handleApplyDiscount}
                            shipping={30000}
                        />
                        <Button fullWidth size="large" type="submit" variant="contained"
                                disabled={cart.length === 0}>
                            Thanh toán
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
