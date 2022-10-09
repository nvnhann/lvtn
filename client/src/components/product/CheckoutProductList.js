import PropTypes from 'prop-types';
import {Icon} from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import {styled} from '@material-ui/core/styles';
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core';
import {URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {MIconButton} from "../@material-extend";
import {fCurrency} from "../../_helper/formatCurrentCy";
import {useDispatch} from "react-redux";
import {removeFromCart, setQuantity} from "../../redux/slices/cart";
// utils

// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(0.5, 0.75),
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`
}));

const ThumbImgStyle = styled('img')(({theme}) => ({
    width: 64,
    height: 64,
    objectFit: 'cover',
    marginRight: theme.spacing(2),
    borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

Incrementer.propTypes = {
    available: PropTypes.number,
    quantity: PropTypes.number,
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func
};

function Incrementer({available, quantity, onIncrease, onDecrease}) {
    return (
        <Box sx={{width: 96, textAlign: 'right'}}>
            <IncrementerStyle>
                <MIconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
                    <Icon icon={minusFill} width={16} height={16}/>
                </MIconButton>
                {quantity}
                <MIconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
                    <Icon icon={plusFill} width={16} height={16}/>
                </MIconButton>
            </IncrementerStyle>
            <Typography variant="caption" sx={{color: 'text.secondary'}}>
                Có sẵn: {available}
            </Typography>
        </Box>
    );
}

ProductList.propTypes = {
    products: PropTypes.array
};

export default function ProductList({products}) {
    const dispatch = useDispatch();
    return (
        <TableContainer sx={{minWidth: 720}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Sách</TableCell>
                        <TableCell align="left">Giá</TableCell>
                        <TableCell align="left">Số lượng</TableCell>
                        <TableCell align="right">Tổng giá</TableCell>
                        <TableCell align="right"/>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {products.map((product) => {
                        const {sp_id, sp_ten, ctpn_gia, sp_hinhanh, sp_soluong, ctpn_soluong} = product;
                        return (
                            <TableRow key={sp_id}>
                                <TableCell>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <ThumbImgStyle alt="product image"
                                                       src={URL_PUBLIC_IMAGES + sp_hinhanh[sp_hinhanh.length - 1].ha_hinh}/>
                                        <Box>
                                            <Typography noWrap variant="subtitle2" sx={{maxWidth: 240, mb: 0.5}}>
                                                {sp_ten}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell align="left">{fCurrency(ctpn_gia)}</TableCell>

                                <TableCell align="left">
                                    <Incrementer
                                        quantity={sp_soluong}
                                        available={ctpn_soluong}
                                        onDecrease={() => dispatch(setQuantity({
                                            id_sp: sp_id,
                                            so_luong: sp_soluong < 2 ? 1 : sp_soluong - 1
                                        }))}
                                        onIncrease={() => dispatch(setQuantity({
                                            id_sp: sp_id,
                                            so_luong: sp_soluong + 1
                                        }))}
                                    />
                                </TableCell>

                                <TableCell align="right">{fCurrency(sp_soluong * ctpn_gia)}</TableCell>

                                <TableCell align="right">
                                    <MIconButton onClick={() => dispatch(removeFromCart(sp_id))}>
                                        <Icon icon={trash2Fill} width={20} height={20}/>
                                    </MIconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
