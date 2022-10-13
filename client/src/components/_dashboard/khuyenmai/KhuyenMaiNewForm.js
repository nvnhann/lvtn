import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack5';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {DateRangePicker, LoadingButton} from '@material-ui/lab';
import {Autocomplete, Box, Card, Grid, Stack, TextField,} from '@material-ui/core';
// utils
// routes
//
import {getData, postData, putData} from '../../../_helper/httpProvider';
import {API_BASE_URL} from '../../../config/configUrl';
import {Icon} from '@iconify/react';
import {MIconButton} from '../../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import {useEffect, useState} from 'react';
import {formatDate} from "../../../_helper/formatDate";

// ----------------------------------------------------------------------

KhuyenMaiNewForm.propTypes = {
    isEdit: PropTypes.bool,
    current: PropTypes.object,
    id: PropTypes.string,
    setEdit: PropTypes.func,
    setLoad: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function KhuyenMaiNewForm({isEdit, current, setEdit, setLoad}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [tlList, setTlList] = useState([]);
    const [books, setBooks] = useState([]);

    const NewSchema = Yup.object().shape({
        sp_idtl: Yup.object().required('Vui lòng nhập thể loại'),
        phan_tram: Yup.number().integer('Phần trăm không hợp lệ!').min(1, 'Phần trăm không hợp lệ!').required('Vui lòng nhập phần trăm')
    });


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            sp_idtl:
                current?.sp_idtl?.tl_id ? {
                    tl_ten: current.sp_idtl.tl_ten,
                    tl_id: current.sp_idtl.tl_id,
                } : '',
            sp_idsp:
                current?.sp_idsp?.sp_id ? {
                    sp_ten: current?.sp_idsp.sp_ten,
                    sp_id: current?.sp_idsp.sp_id,
                    sp_masp: current?.sp_idsp.sp_masp
                } : '',
            phan_tram: current?.km_phantramgiam || 0,
            ngay_km: [current?.km_ngaybatdau || null, current?.km_ngayketthuc || null]
        },
        validationSchema: NewSchema,
        onSubmit: async (values, {resetForm}) => {
            let _values = {};
            _values.km_phantramgiam = values.phan_tram;
            _values.km_ngaybatdau = formatDate(values.ngay_km[0]) !== '1970-01-01' ? formatDate(values.ngay_km[0]) : null;
            _values.km_ngayketthuc = formatDate(values.ngay_km[1]) !== '1970-01-01' ? formatDate(values.ngay_km[1]) : null;
            _values.km_idsp = values.sp_idsp?.sp_id;
            _values.km_idtl = values.sp_idtl?.tl_id;
            console.log(_values)
            try {
                if (isEdit) {
                    await putData(API_BASE_URL + '/khuyenmai/' + current?.km_id, _values)
                    if (setEdit) setEdit({isEdit: false, current: {}});
                } else {
                    await postData(API_BASE_URL + '/khuyenmai', _values);
                    // resetForm();
                }
                if (setLoad) setLoad((e) => e + 1);
                enqueueSnackbar(
                    !isEdit ? 'Thêm khuyến mãi thành công' : 'Cập nhật thành công!',
                    {
                        variant: 'success',
                    },
                );
            } catch (error) {
                console.error(error);
                enqueueSnackbar(error.response.data, {
                    variant: 'error',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
            }
        },
    });

    const {errors, touched, handleSubmit, getFieldProps, values, setFieldValue} = formik;

    useEffect(() => {
        (async () => {
            const _tl = await getData(API_BASE_URL + '/theloai');
            setTlList(_tl.data);
            const _books = await getData(API_BASE_URL + '/book/theloai?search=' + values.sp_idtl?.tl_id);
            setBooks(_books.data);
        })();
    }, [values.sp_idtl?.tl_id]);


    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Card sx={{p: 3}}>
                            <Stack spacing={3}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            freeSolo
                                            value={values.sp_idtl}
                                            onChange={(event, newValue) => {
                                                setFieldValue('sp_idtl', newValue);
                                            }}
                                            options={tlList?.map((option) => ({
                                                tl_id: option.tl_id,
                                                tl_ten: option.tl_ten,
                                            }))}
                                            renderInput={(params) => (
                                                <TextField label="Thể loại" {...params}
                                                           error={Boolean(touched.sp_idtl && errors.sp_idtl)}
                                                           helperText={touched.sp_idtl && errors.sp_idtl}/>
                                            )}
                                            getOptionLabel={(option) => option.tl_ten || ''}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            freeSolo
                                            value={values.sp_idsp}
                                            onChange={(event, newValue) => {
                                                setFieldValue('sp_idsp', newValue);
                                            }}
                                            options={books?.map((option) => ({
                                                sp_id: option.sp_id,
                                                sp_ten: option.sp_ten,
                                                sp_masp: option.sp_masp
                                            }))}
                                            renderInput={(params) => (
                                                <TextField
                                                    label="Sản phẩm"
                                                    {...params}
                                                />
                                            )}
                                            getOptionLabel={(option) => option.sp_masp
                                                ? `${option.sp_masp} - ${option.sp_ten}`
                                                : ''}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            {...getFieldProps('phan_tram')}
                                            label={'Phần trăm'}
                                            error={Boolean(touched.phan_tram && errors.phan_tram)}
                                            helperText={touched.phan_tram && errors.phan_tram}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={8}>
                                        <DateRangePicker
                                            startText="Ngày bắt đầu"
                                            endText="Ngày kết thúc"
                                            onChange={(newValue) => setFieldValue('ngay_km', newValue)}
                                            value={values.ngay_km}
                                            renderInput={(startProps, endProps) => (
                                                <>
                                                    <TextField {...startProps} />
                                                    <Box sx={{mx: 2}}>đến</Box>
                                                    <TextField {...endProps} />
                                                </>
                                            )}
                                        />

                                    </Grid>
                                </Grid>
                                <Box
                                    sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}
                                >
                                    <LoadingButton type="submit" variant="contained">
                                        {!isEdit ? 'Thêm' : 'Lưu'}
                                    </LoadingButton>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
