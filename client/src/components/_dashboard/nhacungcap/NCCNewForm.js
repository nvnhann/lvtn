import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack5';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {LoadingButton} from '@material-ui/lab';
import {Box, Card, Grid, Stack, TextField} from '@material-ui/core';
// utils
import {postData, putData} from '../../../_helper/httpProvider';
import {API_BASE_URL} from '../../../config/configUrl';
import {Icon} from '@iconify/react';
import {MIconButton} from '../../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';

// ----------------------------------------------------------------------

NCCNewForm.propTypes = {
    isEdit: PropTypes.bool,
    current: PropTypes.object,
    id: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function NCCNewForm({isEdit, current, id}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const NewSchema = Yup.object().shape({
        ncc_ten: Yup.string().required('Vui lòng nhập tên'),
        ncc_email: Yup.string()
            .required('Vui lòng nhập email')
            .email('Email không hợp lệ!'),
        ncc_sdt: Yup.string().required('Vui lòng nhập số điện thoại'),
        ncc_diachi: Yup.string().required('Vui lòng nhập địa chỉ'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            ncc_ten: current?.ncc_ten || '',
            ncc_email: current?.ncc_email || '',
            ncc_sdt: current?.ncc_sdt || '',
            ncc_diachi: current?.ncc_diachi || '',
        },
        validationSchema: NewSchema,
        onSubmit: async (values, {resetForm, setFieldValue}) => {
            try {
                if (isEdit) {
                    await putData(API_BASE_URL + `/nhacungcap/${id}/edit`, values);
                } else {
                    await postData(API_BASE_URL + `/nhacungcap/create`, values);
                    resetForm();
                }
                enqueueSnackbar(
                    !isEdit ? 'Thêm nhà cung cấp thành công' : 'Cập nhật thành công!',
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
    const {errors, touched, handleSubmit, getFieldProps} = formik;

    console.log(errors);
    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Card sx={{p: 3}}>
                            <Stack spacing={3}>
                                <Stack
                                    direction={{xs: 'column', sm: 'row'}}
                                    spacing={{xs: 3, sm: 2}}
                                >
                                    <TextField
                                        fullWidth
                                        label="Tên nhà cung cấp"
                                        {...getFieldProps('ncc_ten')}
                                        error={Boolean(touched.ncc_ten && errors.ncc_ten)}
                                        helperText={touched.ncc_ten && errors.ncc_ten}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        {...getFieldProps('ncc_sdt')}
                                        error={Boolean(touched.ncc_sdt && errors.ncc_sdt)}
                                        helperText={touched.ncc_sdt && errors.ncc_sdt}
                                    />
                                </Stack>

                                <TextField
                                    fullWidth
                                    label="Email"
                                    {...getFieldProps('ncc_email')}
                                    error={Boolean(touched.ncc_email && errors.ncc_email)}
                                    helperText={touched.ncc_email && errors.ncc_email}
                                />

                                <TextField
                                    fullWidth
                                    label="Địa chỉ"
                                    multiline
                                    rows={4}
                                    {...getFieldProps('ncc_diachi')}
                                    error={Boolean(touched.ncc_diachi && errors.ncc_diachi)}
                                    helperText={touched.ncc_diachi && errors.ncc_diachi}
                                />
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
