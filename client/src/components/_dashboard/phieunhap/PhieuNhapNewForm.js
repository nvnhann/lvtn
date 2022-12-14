import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack5';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {LoadingButton} from '@material-ui/lab';
import {
    Autocomplete,
    Box,
    Card,
    Grid,
    IconButton,
    Stack,
    Table,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@material-ui/core';
//
import {useEffect, useState} from 'react';
import {Icon} from '@iconify/react';

import {MIconButton} from '../../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import {getData, postData, putData} from "../../../_helper/httpProvider";
import {API_BASE_URL} from "../../../config/configUrl";
import {fCurrency} from "../../../_helper/formatCurrentCy";

// ----------------------------------------------------------------------
PhieuNhapNewForm.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
    id: PropTypes.string,
    user: PropTypes.object,
};
// ----------------------------------------------------------------------

export default function PhieuNhapNewForm({isEdit, current, id, user}) {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [books, setBooks] = useState([]);
    const [nhacungcap, setNhacungcap] = useState([]);
    const [listBooks, setListBooks] = useState([]);

    useEffect(() => {
        (async () => {
            const _books = await getData(API_BASE_URL + '/books');
            setBooks(_books.data);
            const _ncc = await getData(API_BASE_URL + '/nhacungcap');
            setNhacungcap(_ncc.data);
            if (isEdit && current.length > 0) {
                current.map(b => {
                    return setListBooks((preState) => [
                        ...preState,
                        {
                            ctpn_masp: b.sp_masp,
                            ctpn_idsp: b.ctpn_idsp,
                            ctpn_tensp: b.sp_ten,
                            ctpn_gia: b.ctpn_gia,
                            ctpn_soluong: b.ctpn_soluong,
                        },
                    ]);
                })
            }
        })();
    }, [isEdit, current]);

    const NewPhieuNhapSchema = Yup.object().shape({
        fullname: Yup.string().required('Vui l??ng nh???p h??? t??n'),
        pn_idncc: Yup.object().required('Vui l??ng ch???n nh?? cung c???p'),
        ctpn_idsp: Yup.object().required('Vui l??ng ch???n s??ch'),
        ctpn_soluong: Yup.number()
            .min(1, 'S??? l?????ng kh??ng h???p l???')
            .positive('S??? l?????ng kh??ng h???p l???')
            .integer('S??? l?????ng kh??ng h???p l???')
            .required('Vui l??ng nh???p s??? l?????ng'),
        ctpn_gia: Yup.number()
            .min(1, 'Gi?? kh??ng h???p l???')
            .required('Vui l??ng nh???p gi??'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            pn_idnv: current[0]?.idnv || user?.id,
            fullname: current[0]?.fullname || user?.fullname || '',
            ctpn_idsp: '',
            ctpn_soluong: 1,
            ctpn_gia: 1000,
            pn_idncc: current[0]?.ncc_id ? {
                ncc_id: current[0]?.ncc_id,
                ncc_ten: current[0]?.ncc_ten,
            } : '',
        },
        validationSchema: NewPhieuNhapSchema,
        onSubmit: async (values, {setFieldValue}) => {
            let check = false;
            // eslint-disable-next-line array-callback-return
            listBooks.map((b) => {
                if (b.ctpn_masp === values.ctpn_idsp.sp_masp) check = true;
            });
            if (check) {
                enqueueSnackbar('S??ch ???? c?? trong phi???u nh???p!', {
                    variant: 'error',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
                return;
            }
            setListBooks((preState) => [
                ...preState,
                {
                    ctpn_masp: values.ctpn_idsp.sp_masp,
                    ctpn_idsp: values.ctpn_idsp.sp_id,
                    ctpn_tensp: values.ctpn_idsp.sp_ten,
                    ctpn_gia: values.ctpn_gia,
                    ctpn_soluong: values.ctpn_soluong,
                },
            ]);
        },
    });
    const {
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        values,
        setFieldValue,
    } = formik;
    const handleSubmitPN = async () => {
        if (listBooks.length === 0) {
            enqueueSnackbar('Ch??a c?? s???n ph???m!', {
                variant: 'error',
                action: (key) => (
                    <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill}/>
                    </MIconButton>
                ),
            });
            return;
        }
        let _values = {};
        _values.pn_idncc = values.pn_idncc.ncc_id;
        _values.pn_idnv = values.pn_idnv;
        _values.pn_tongtien = listBooks.reduce(
            (total, item) => item.ctpn_soluong * item.ctpn_gia + total,
            0,
        );
        _values.sanpham = listBooks;
        try {
            if (isEdit) {
                await putData(API_BASE_URL + '/phieunhap/' + current[0]?.pn_id, _values);
            } else {
                await postData(API_BASE_URL + '/phieunhap', _values);
                setListBooks([]);
            }
            enqueueSnackbar(!isEdit ? 'Th??m th??nh c??ng' : 'C???p nh???t th??nh c??ng', {
                variant: 'success',
            });
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Card sx={{p: 3}}>
                            <Stack spacing={3}>
                                <Grid container spacing={{xs: 3, sm: 2}}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="Nh??n vi??n"
                                            {...getFieldProps('fullname')}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <Autocomplete
                                            freeSolo
                                            value={values.pn_idncc}
                                            onChange={(event, newValue) => {
                                                setFieldValue('pn_idncc', newValue || '');
                                            }}
                                            options={nhacungcap?.map((option) => ({
                                                ncc_id: option.ncc_id,
                                                ncc_ten: option.ncc_ten,
                                            }))}
                                            renderInput={(params) => (
                                                <TextField
                                                    label="Nh?? cung c???p"
                                                    {...params}
                                                    error={Boolean(touched.pn_idncc && errors.pn_idncc)}
                                                    helperText={touched.pn_idncc && errors.pn_idncc}
                                                />
                                            )}
                                            getOptionLabel={(option) => option.ncc_ten || ''}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={{xs: 3, sm: 2}}>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            freeSolo
                                            value={values.ctpn_idsp}
                                            onChange={(event, newValue) => {
                                                setFieldValue('ctpn_idsp', newValue || '');
                                            }}
                                            options={books?.map((option) => ({
                                                sp_id: option.sp_id,
                                                sp_ten: option.sp_ten,
                                                sp_masp: option.sp_masp,
                                            }))}
                                            renderInput={(params) => (
                                                <TextField
                                                    label="S??ch"
                                                    {...params}
                                                    error={Boolean(touched.ctpn_idsp && errors.ctpn_idsp)}
                                                    helperText={touched.ctpn_idsp && errors.ctpn_idsp}
                                                />
                                            )}
                                            getOptionLabel={(option) =>
                                                option.sp_masp
                                                    ? `${option.sp_masp} - ${option.sp_ten}`
                                                    : ''
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack
                                            direction={{xs: 'column', sm: 'row'}}
                                            spacing={{xs: 3, sm: 2}}
                                        >
                                            <TextField
                                                {...getFieldProps('ctpn_soluong')}
                                                label="S??? l?????ng"
                                                error={Boolean(
                                                    touched.ctpn_soluong && errors.ctpn_soluong,
                                                )}
                                                helperText={touched.ctpn_soluong && errors.ctpn_soluong}
                                            />
                                            <TextField
                                                {...getFieldProps('ctpn_gia')}
                                                label="Gi??"
                                                error={Boolean(touched.ctpn_gia && errors.ctpn_gia)}
                                                helperText={touched.ctpn_gia && errors.ctpn_gia}
                                            />
                                            <IconButton type="submit">
                                                <Icon icon="akar-icons:circle-plus"/>
                                            </IconButton>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <Box
                                    sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}
                                >
                                    <LoadingButton
                                        type="button"
                                        variant="contained"
                                        onClick={() => handleSubmitPN()}
                                    >
                                        {!isEdit ? 'Th??m' : 'L??u'}
                                    </LoadingButton>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card>
                            {listBooks.length > 0 && (
                                <Box padding={4}>
                                    <Typography variant="h4" align="center">
                                        Phi???u nh???p
                                    </Typography>
                                    <Stack
                                        spacing={{xs: 3, sm: 2}}
                                        m={2}
                                    >
                                        <Typography>
                                            Nh??n vi??n: <b>{values.fullname}</b>
                                        </Typography>
                                        <Typography>
                                            Nh?? cung c???p: <b>{values.pn_idncc?.ncc_ten}</b>
                                        </Typography>
                                        <Typography>
                                            T???ng ti???n: <b>{fCurrency(listBooks.reduce(
                                            (total, item) => item.ctpn_soluong * item.ctpn_gia + total,
                                            0,
                                        ))}</b>
                                        </Typography>
                                    </Stack>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>M?? s???n ph???m</TableCell>
                                                <TableCell>T??n s???n ph???m</TableCell>
                                                <TableCell>S??? l?????ng</TableCell>
                                                <TableCell>Gi??</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {listBooks.map((book, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{book.ctpn_masp}</TableCell>
                                                <TableCell>{book.ctpn_tensp}</TableCell>
                                                <TableCell>{book.ctpn_soluong}</TableCell>
                                                <TableCell>{fCurrency(book.ctpn_gia)}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            let _newBook = listBooks.filter(
                                                                (b) => b.ctpn_masp !== book.ctpn_masp,
                                                            );
                                                            setListBooks(_newBook);
                                                        }}
                                                    >
                                                        <Icon icon="ep:remove-filled" color="#F44336"/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </Table>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
