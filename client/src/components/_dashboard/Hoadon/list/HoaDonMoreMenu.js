import PropTypes from 'prop-types';
import {Icon} from '@iconify/react';
import {useRef, useState} from 'react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import {
    Box,
    Card,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import {fCurrency} from "../../../../_helper/formatCurrentCy";
import Scrollbar from "../../../Scrollbar";
import {URL_PUBLIC_IMAGES} from "../../../../config/configUrl";
import DialogConfirm from "../../DialogConfirm";
import {styled} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
// ------------------------------------------------------------------------------------------
const ThumbImgStyle = styled('img')(({theme}) => ({
    width: 64,
    height: 64,
    objectFit: 'cover',
    marginRight: theme.spacing(2),
    borderRadius: theme.shape.borderRadiusSm
}));

const ThumbImgStyleOrder = styled('img')(({theme}) => ({
    width: 300,
    height: 400,
    objectFit: 'cover',
    margin: '0 auto',
    borderRadius: theme.shape.borderRadiusSm
}));
// ------------------------------------------------------------------------------------------

HoaDonMoreMenu.propTypes = {
    hoadon: PropTypes.object,
};

export default function HoaDonMoreMenu({hoadon, status, setLoad}) {
    const ref = useRef(null);
    const id = useSelector(state => state.user.current?.id);

    const [isOpen, setIsOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);

    const handleClickOpenDetail = () => {
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
    };

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Icon icon={moreVerticalFill} width={20} height={20}/>
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: {width: 200, maxWidth: '100%'},
                }}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuItem
                    sx={{color: 'text.secondary'}}
                    onClick={() => {
                        setIsOpen(false);
                        handleClickOpenDetail();
                    }}
                >
                    <ListItemIcon>
                        <Icon icon="el:eye-open" width={24} height={24}/>
                    </ListItemIcon>

                    <ListItemText
                        primary="Xem chi tiết"
                        primaryTypographyProps={{variant: 'body2'}}
                    />
                </MenuItem>
            </Menu>

            <DialogConfirm
                open={openDetail}
                handleClose={handleCloseDetail}
                title='Chi tiết hóa đơn'
                maxWidth="md"
                status={status}
                idhd={hoadon.hd_id}
                setLoad={setLoad}
                idnv={id}
                message={
                    <>
                        <Card sx={{my: 2, p: 2}}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                    Họ và tên
                                </Typography>
                                <Typography variant="body2">{hoadon.hd_tenkh}</Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                    Số điện thoại
                                </Typography>
                                <Typography variant="body2">{hoadon.hd_sdt}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                    Email
                                </Typography>
                                <Typography variant="body2">{hoadon.hd_email}</Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                    Tiền vận chuyển
                                </Typography>
                                <Typography variant="body2">{fCurrency(hoadon.hd_tienvc)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                    Tổng đơn
                                </Typography>
                                <Typography variant="body2">{fCurrency(hoadon.hd_tongtien+hoadon.hd_tienvc)}</Typography>
                            </Stack>
                        </Card>
                        <Card>
                            <Scrollbar>
                                <TableContainer sx={{minWidth: 720, mt: 2}}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sách</TableCell>
                                                <TableCell align="left">Giá</TableCell>
                                                <TableCell align="center">Số lượng</TableCell>
                                                <TableCell align="center">Tổng giá</TableCell>
                                                <TableCell align="right"/>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {hoadon.cthd?.map((e, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>
                                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                            <ThumbImgStyle alt="product image"
                                                                           src={URL_PUBLIC_IMAGES + e.ha_hinh}/>
                                                            <Box>
                                                                <Typography noWrap variant="subtitle2"
                                                                            sx={{maxWidth: 240, mb: 0.5}}>
                                                                    {e.sp_ten}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            component="span"
                                                            variant="body1"
                                                            sx={{
                                                                color: 'text.disabled',
                                                                textDecoration: 'line-through'
                                                            }}
                                                        >
                                                            {!!e.cthd_giakm && fCurrency(e.cthd_giaban)}
                                                        </Typography>
                                                        <Typography>
                                                            {!!e.cthd_giakm ? fCurrency(e.cthd_giakm) : fCurrency(e.cthd_giaban)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>{e.cthd_soluong}</TableCell>
                                                    <TableCell align='center'>
                                                        {fCurrency((e.cthd_giakm ? e.cthd_giakm : e.cthd_giaban) * e.cthd_soluong)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                        </Card>
                        {hoadon.trangthai[hoadon.trangthai.length - 1].tt_trangthai === 3 &&
                            <Card sx={{my: 2, p: 2}}>
                                <Typography variant='h3' align='center'>Ảnh giao hàng</Typography>
                                <ThumbImgStyleOrder alt="product image"
                                                    src={URL_PUBLIC_IMAGES + hoadon.trangthai[hoadon.trangthai.length - 1].tt_note}/>
                            </Card>}
                    </>
                }
            />
        </>
    );
}
