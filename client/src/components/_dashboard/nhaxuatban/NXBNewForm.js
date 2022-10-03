import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack, TextField } from '@material-ui/core';
// utils
// routes
//
import { postData, putData } from 'src/_helper/httpProvider';
import { API_BASE_URL } from 'src/config/configUrl';
import { Icon } from '@iconify/react';
import { MIconButton } from 'src/components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';

// ----------------------------------------------------------------------

NXBNewForm.propTypes = {
  isEdit: PropTypes.bool,
  current: PropTypes.object,
  id: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function NXBNewForm({ isEdit, current, id }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    nxb_ten: Yup.string().required('Vui lòng nhập tên'),
    nxb_email: Yup.string()
      .required('Vui lòng nhập email')
      .email('Email không hợp lệ!'),
    nxb_sdt: Yup.string().required('Vui lòng nhập số điện thoại'),
    nxb_diachi: Yup.string().required('Vui lòng nhập địa chỉ'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nxb_ten: current?.nxb_ten || '',
      nxb_email: current?.nxb_email || '',
      nxb_sdt: current?.nxb_sdt || '',
      nxb_diachi: current?.nxb_diachi || '',
    },
    validationSchema: NewSchema,
    onSubmit: async (values, { resetForm, setFieldValue }) => {
      try {
        if (isEdit) {
          await putData(API_BASE_URL + `/nhaxuatban/${id}/edit`, values);
        } else {
          await postData(API_BASE_URL + `/nhaxuatban/create`, values);
          resetForm();
        }
        enqueueSnackbar(
          !isEdit ? 'Thêm nhà xuất bản thành công' : 'Cập nhật thành công!',
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
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        });
      }
    },
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  console.log(errors);
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 3, sm: 2 }}
                >
                  <TextField
                    fullWidth
                    label="Tên nhà xuất bản"
                    {...getFieldProps('nxb_ten')}
                    error={Boolean(touched.nxb_ten && errors.nxb_ten)}
                    helperText={touched.nxb_ten && errors.nxb_ten}
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    {...getFieldProps('nxb_sdt')}
                    error={Boolean(touched.nxb_sdt && errors.nxb_sdt)}
                    helperText={touched.nxb_sdt && errors.nxb_sdt}
                  />
                </Stack>

                <TextField
                  fullWidth
                  label="Email"
                  {...getFieldProps('nxb_email')}
                  error={Boolean(touched.nxb_email && errors.nxb_email)}
                  helperText={touched.nxb_email && errors.nxb_email}
                />

                <TextField
                  fullWidth
                  label="Địa chỉ"
                  multiline
                  rows={4}
                  {...getFieldProps('nxb_diachi')}
                  error={Boolean(touched.nxb_diachi && errors.nxb_diachi)}
                  helperText={touched.nxb_diachi && errors.nxb_diachi}
                />
                <Box
                  sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
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
