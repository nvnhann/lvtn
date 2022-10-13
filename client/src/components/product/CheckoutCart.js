import {Icon} from '@iconify/react';
import {Link as RouterLink} from 'react-router-dom';
import {Form, FormikProvider, useFormik} from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import {Button, Card, CardHeader, Grid, Typography} from '@material-ui/core';
// redux
import CheckoutProductList from './CheckoutProductList';
import {useDispatch, useSelector} from "react-redux";
import {checkout, onNextStep} from "../../redux/slices/product";
import {cartItemCount, removeFromCart} from "../../redux/slices/cart";
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
    const [products, setProducts] = useState([]);
    useEffect(() => {
        (async () => {
            if (cart.length === 0) return;
            const _products = await postData(API_BASE_URL + '/shopcart', {cart: cart});
            setProducts(_products.data);
        })()
    }, [totalItems]);
    const handleDeleteCart = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleNextStep = () => {
        dispatch(onNextStep());
    };

    const handleApplyDiscount = (value) => {
        console.log(value);
    };

    const toltalPrice = () => {
        if (products.length === 0) return 0;
        return products.reduce((total, item) => total + (item.sp_giakhuyenmai ? item.sp_giakhuyenmai : item.ctpn_gia) * item.sp_soluong, 0);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {products: cart},
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            try {
                setSubmitting(true);
                dispatch(checkout({totalPrice: toltalPrice(), shipping: 30000}))
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
                    <Grid item xs={12} md={8}>
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

                    <Grid item xs={12} md={4}>
                        <CheckoutSummary
                            total={toltalPrice() + 30000}
                            enableDiscount
                            subtotal={toltalPrice()}
                            onApplyDiscount={handleApplyDiscount}
                            shipping={30000}
                        />
                        <Button fullWidth size="large" type="submit" variant="contained"
                                disabled={products.length === 0}>
                            Thanh toán
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
