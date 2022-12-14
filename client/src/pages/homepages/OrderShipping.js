import {
    Box,
    Button,
    Card,
    DialogActions,
    FormHelperText,
    IconButton,
    OutlinedInput,
    Stack,
    Step,
    StepButton,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@material-ui/core";
import {styled} from "@material-ui/core/styles";
import {useCallback, useEffect, useState} from "react";
import {API_BASE_URL, URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {useSelector} from "react-redux";
import {getData, putData} from "../../_helper/httpProvider";
import {formatDateTime} from "../../_helper/formatDate";
import {fCurrency} from "../../_helper/formatCurrentCy";
import DialogConfirm from "../../components/_dashboard/DialogConfirm";
import {useSnackbar} from "notistack5";
import Scrollbar from "../../components/Scrollbar";
import * as Yup from 'yup';
import {Form, FormikProvider, useFormik} from "formik";
import {UploadSingleFile} from "../../components/upload";
import {Icon} from '@iconify/react';


//-----------------------------------------------------------------------------
const SearchStyle = styled(OutlinedInput)(({theme}) => ({
    width: 600,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {width: 720, boxShadow: theme.customShadows.z8},
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`,
    },
}));

const ThumbImgStyle = styled('img')(({theme}) => ({
    width: 64,
    height: 64,
    objectFit: 'cover',
    marginRight: theme.spacing(2),
    borderRadius: theme.shape.borderRadiusSm
}));

const LabelStyle = styled(Typography)(({theme}) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1)
}));
//-----------------------------------------------------------------------------
const steps = ["Ch??? l???y h??ng", "??ang giao h??ng", "???? giao"];

export default function OrderShipping() {
    const id = useSelector(state => state.user.current?.id)
    const {enqueueSnackbar} = useSnackbar();

    const [hoadon, setHoadon] = useState([]);
    const [idhd, setIdhd] = useState(null);
    const [open, setOpen] = useState(false);
    const [openOrder, setOpenOrder] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [load, setLoad] = useState(0);
    const [detail, setDetail] = useState({});
    const [search, setSearch] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [openCancel, setOpenCancle] = useState(false);
    const [openCancel1, setOpenCancle1] = useState(false);
    const [reason, setReason] = useState('');

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenCancle = () => {
        setOpenCancle(true);
    };
    const handleClickOpenCancle1 = () => {
        setOpenCancle1(true);
    };

    const handleCloseCancle = () => {
        setOpenCancle(false);
    };

    const handleClickOpenOrder = () => {
        setOpenOrder(true);
    };
    const handleCloseCancle1 = () => {
        setOpenCancle1(false);
    };

    const handleCloseOrder = () => {
        setOpenOrder(false);
    };

    const handleClickOpenDetail = () => {
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
    };

    const NewSchema = Yup.object().shape({
        cover: Yup.mixed().required('Vui l??ng ch???n h??nh ???nh')
    });

    const formik = useFormik({
        initialValues: {
            cover: null,
            idhd: null
        },
        validationSchema: NewSchema,
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            try {
                const formDt = new FormData();
                formDt.append('hoadon', values.cover.file);
                formDt.append('_data', JSON.stringify({
                    tt_trangthai: 3,
                    tt_idnv: id
                }))
                await putData(API_BASE_URL + `/hoadon/${values.idhd}`, formDt, {
                    'content-type': 'multipart/form-data',
                });
                setLoad(e => e + 1);
                resetForm()
                handleCloseOrder()
                enqueueSnackbar('Giao h??ng th??nh c??ng', {variant: 'success'});
            } catch (error) {
                console.error(error);
                setSubmitting(false);
            }
        }
    });
    const {errors, values, touched, handleSubmit, setFieldValue} = formik;

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFieldValue('cover', {
                    file: file,
                    preview: URL.createObjectURL(file)
                });
            }
        },
        [setFieldValue]
    );
    useEffect(() => {
        (async () => {
            const _hoadon = await getData(API_BASE_URL + `/hoadonnv/${id}?trangthai=${activeStep + 1}&&search=${search}`);
            setHoadon(_hoadon.data);
        })();
    }, [id, load, search, activeStep]);

    const changeOrder = async () => {
        try {
            if (!idhd) return;
            await putData(API_BASE_URL + `/hoadon/${idhd}`, {tt_trangthai: 2, tt_idnv: id});
            setLoad(e => e + 1)
            enqueueSnackbar(
                'L???y h??ng th??nh c??ng!',
                {
                    variant: 'success',
                },
            );
            setIdhd('')
        } catch (err) {
            console.log(err)
        }
    }

    const changeOrderCancle = async () => {
        try {
            if (!idhd) return;
            await putData(API_BASE_URL + `/hoadoncancle/${idhd}`);
            setLoad(e => e + 1)
            enqueueSnackbar(
                'T??? ch???i ????n h??ng th??nh c??ng!',
                {
                    variant: 'success',
                },
            );
            setIdhd('')
        } catch (err) {
            console.log(err)
        }
    }

    const changeOrderCancle1 = async () => {
        try {
            if (!idhd) return;
            if(reason === '') return  enqueueSnackbar(
                'Vui l??ng nh???p l?? do h???y!',
                {
                    variant: 'error',
                },
            );
            const letterNumber = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
            if(reason?.match(letterNumber)) return  enqueueSnackbar(
                'L?? do kh??ng h???p l??!',
                {
                    variant: 'error',
                },
            );
            await putData(API_BASE_URL + `/hoadon/${idhd}`, {tt_trangthai: 4, tt_idnv: id, tt_note: reason});
            setLoad(e => e + 1)
            enqueueSnackbar(
                'H???y ????n h??ng th??nh c??ng!',
                {
                    variant: 'success',
                },
            );
            setReason('');
            handleCloseCancle1()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Card sx={{my: 2}}>
                <SearchStyle
                    sx={{m: 2}}
                    placeholder="T??m ki???m ????n h??ng..."
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Stack direction='row' justifyContent='center'>
                    <Stepper nonLinear activeStep={activeStep} sx={{m: 2}}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton color="inherit" onClick={handleStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Stack>
            </Card>
            <Card sx={{p: 2}}>
                <TableContainer sx={{minWidth: 720}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID ????n</TableCell>
                                <TableCell align="left">H??? t??n</TableCell>
                                <TableCell align="left">T???ng ????n</TableCell>
                                <TableCell align="left">Ti???n v???n chuy???n</TableCell>
                                <TableCell align="left">HTTT</TableCell>
                                <TableCell align="left">Ng??y t???o</TableCell>
                                <TableCell align="left">Tr???ng th??i</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {hoadon?.map((e, idx) => {
                                let {
                                    hd_id,
                                    hd_tenkh,
                                    hd_tongtien,
                                    hd_tienvc,
                                    hd_hinhthucthanhtoan,
                                    hd_ngaytao,
                                    trangthai
                                } = e;
                                const hd_trangthai = trangthai[trangthai.length - 1].tt_trangthai
                                let hd_ngaytt = trangthai[trangthai.length - 1].tt_ngaycapnhat
                                return (
                                    <TableRow>
                                        <TableCell>#{hd_id}</TableCell>
                                        <TableCell>{hd_tenkh}</TableCell>
                                        <TableCell
                                            sx={{width: '7rem'}}>{!!hd_tienvc ? fCurrency(hd_tongtien + hd_tienvc) : fCurrency(hd_tongtien)}</TableCell>
                                        <TableCell>{!!hd_tienvc ? fCurrency(hd_tienvc) : '0??'}</TableCell>
                                        <TableCell>{hd_hinhthucthanhtoan}</TableCell>
                                        <TableCell>{formatDateTime(hd_ngaytao)}</TableCell>
                                        <TableCell>
                                            {hd_trangthai === 0 &&
                                                <Typography color='lightseagreen'>Ch??? x??c nh???n</Typography>}
                                            {hd_trangthai === 1 &&
                                                <>
                                                    <Typography color='lightgreen'>???? x??c nh???n</Typography>
                                                    <Typography
                                                        variant='subtitle2'> {formatDateTime(hd_ngaytt)}</Typography>
                                                </>}
                                            {hd_trangthai === 2 &&
                                                <Typography color='blueviolet'>???? l???y h??ng</Typography>}
                                            {hd_trangthai === 3 &&
                                                <>
                                                    <Typography color='hotpink'>???? giao h??ng </Typography>
                                                    <Typography
                                                        variant='subtitle2'> {formatDateTime(hd_ngaytt)}</Typography>
                                                </>}
                                            {hd_trangthai === 4 && <Typography color='error'>???? h???y</Typography>}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {(hd_trangthai === 1) &&
                                                <>
                                                <Button onClick={() => {
                                                    setIdhd(hd_id);
                                                    handleClickOpen()
                                                }}>
                                                    L???y h??ng
                                                </Button>
                                                    <Button variant='contained' color='error' onClick={() => {
                                                        setIdhd(hd_id);
                                                        handleClickOpenCancle()
                                                    }}>
                                                        T??? ch???i
                                                    </Button>

                                                </>}
                                            {(hd_trangthai === 2) &&
                                                <>
                                                <Button color='info' onClick={() => {
                                                    setIdhd(hd_id);
                                                    setFieldValue('idhd', hd_id);
                                                    handleClickOpenOrder()
                                                }}>
                                                    Giao h??ng
                                                </Button>
                                                    <Button color='error' onClick={() => {
                                                        setIdhd(hd_id);
                                                        handleClickOpenCancle1()
                                                    }}>
                                                        H???y
                                                    </Button>
                                                    </>

                                            }
                                            <IconButton onClick={() => {
                                                setDetail(e);
                                                handleClickOpenDetail();
                                            }}>
                                                <Icon icon="el:eye-open"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <DialogConfirm
                open={open}
                handleClose={handleClose}
                message={
                    <>
                        <Typography color="error" variant="h4" align="center">
                            B???n ???? l???y h??ng ?????y ??????
                        </Typography>
                    </>
                }
                excFunc={changeOrder}
            />

            <DialogConfirm
                open={openCancel}
                handleClose={handleCloseCancle}
                message={
                    <>
                        <Typography color="error" variant="h4" align="center">
                            B???n mu???n t??? ch???i nh???n ????n h??ng?
                        </Typography>
                    </>
                }
                excFunc={changeOrderCancle}
            />


            <DialogConfirm
                open={openOrder}
                handleClose={handleCloseOrder}
                showAction={false}
                message={
                    <>
                        <FormikProvider value={formik}>
                            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <Typography color="error" variant="h4" align="center">
                                    B???n ???? giao h??ng th??nh c??ng?
                                </Typography>
                                <LabelStyle>H??nh ???nh</LabelStyle>
                                <UploadSingleFile
                                    maxSize={3145728}
                                    accept="image/*"
                                    file={values.cover}
                                    onDrop={handleDrop}
                                    error={Boolean(touched.cover && errors.cover)}
                                />
                                {touched.cover && errors.cover && (
                                    <FormHelperText error sx={{px: 2}}>
                                        {touched.cover && errors.cover}
                                    </FormHelperText>
                                )}

                                <DialogActions>
                                    <Button color="inherit" onClick={handleCloseOrder}>
                                        ????ng
                                    </Button>
                                    <Button variant="contained" type='submit'>
                                        ?????ng ??
                                    </Button>
                                </DialogActions>
                            </Form>
                        </FormikProvider>
                    </>
                }
            />
            <DialogConfirm
                open={openCancel1}
                handleClose={handleCloseCancle1}
                message={
                    <>
                        <Typography color="error" variant="h4" align="center">
                            B???n ch???c ch???n mu???n h???y ????n h??ng?
                        </Typography>
                        <TextField
                            label="L?? do h???y"
                            fullWidth
                            multiline
                            value={reason}
                            onChange={e=>setReason(e.target.value)}
                            rows={3}
                        />
                    </>
                }
                linkTo
                isClose={true}
                excFunc={changeOrderCancle1}
            />

            <DialogConfirm
                open={openDetail}
                handleClose={handleCloseDetail}
                title='Chi ti???t ????n h??ng'
                maxWidth="md"
                message={
                    <>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx
                                        enableEdit={{color: 'text.secondary'}}>
                                H??? v?? t??n
                            </Typography>
                            <Typography variant="body2">{detail.hd_tenkh}</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx
                                        enableEdit={{color: 'text.secondary'}}>
                                S??? ??i???n tho???i
                            </Typography>
                            <Typography variant="body2">{detail.hd_sdt}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx
                                        enableEdit={{color: 'text.secondary'}}>
                                Email
                            </Typography>
                            <Typography variant="body2">{detail.hd_email}</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx
                                        enableEdit={{color: 'text.secondary'}}>
                                ?????a ch???
                            </Typography>
                            <Typography variant="body2">{detail.hd_diachi}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx
                                        enableEdit={{color: 'text.secondary'}}>
                                T???ng ????n
                            </Typography>
                            <Typography variant="body2">{fCurrency(detail.hd_tongtien)}</Typography>
                        </Stack>
                        <Scrollbar>
                            <TableContainer sx={{minWidth: 720, mt: 2}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>S??ch</TableCell>
                                            <TableCell align="left">Gi??</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">T???ng gi??</TableCell>
                                            <TableCell align="right"/>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {detail.cthd?.map((e, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        <ThumbImgStyle alt="product image"
                                                                       src={URL_PUBLIC_IMAGES + e.ha_hinh}/>
                                                        <Box>
                                                            <Typography noWrap variant="subtitle2"
                                                                        sx={{
                                                                            maxWidth: 240,
                                                                            mb: 0.5
                                                                        }}>
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
                                                <TableCell
                                                    align='center'>{e.cthd_soluong}</TableCell>
                                                <TableCell align='center'>
                                                    {fCurrency((e.cthd_giakm ? e.cthd_giakm : e.cthd_giaban) * e.cthd_soluong)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </>
                }
            />
        </>
    )
}