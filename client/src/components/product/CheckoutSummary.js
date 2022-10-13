import PropTypes from 'prop-types';
// material
import {Box, Card, CardContent, CardHeader, Divider, Stack, Typography} from '@material-ui/core';
import {fCurrency} from "../../_helper/formatCurrentCy";
// utils

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
    total: PropTypes.number,
    discount: PropTypes.number,
    subtotal: PropTypes.number,
    shipping: PropTypes.number,
    onEdit: PropTypes.func,
    enableEdit: PropTypes.bool,
    onApplyDiscount: PropTypes.func,
    enableDiscount: PropTypes.bool
};

export default function CheckoutSummary({
                                            total,
                                            onEdit,
                                            subtotal,
                                            shipping = null,
                                            onApplyDiscount,
                                            enableDiscount = false
                                        }) {
    return (
        <Card sx={{mb: 3}}>
            <CardHeader
                title="Thông tin thanh toán"
            />

            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            Tổng tiền sản phẩm
                        </Typography>
                        <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            Phí vận chuyển
                        </Typography>
                        <Typography variant="subtitle2">{shipping ? fCurrency(shipping) : ''}</Typography>
                    </Stack>

                    <Divider/>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle1">Tổng cộng</Typography>
                        <Box sx={{textAlign: 'right'}}>
                            <Typography variant="subtitle1" sx={{color: 'error.main'}}>
                                {fCurrency(total)}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
