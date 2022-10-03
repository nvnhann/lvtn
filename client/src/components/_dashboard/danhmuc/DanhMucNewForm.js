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

DanhMucNewForm.propTypes = {
  isEdit: PropTypes.bool,
  current: PropTypes.object,
  id: PropTypes.string,
  setEdit: PropTypes.func,
  setLoad: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function DanhMucNewForm({ isEdit, current, setEdit, setLoad }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    dm_ten: Yup.string().required('Vui lòng nhập tên'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      dm_ten: current?.dm_ten || '',
    },
    validationSchema: NewSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEdit) {
          await putData(API_BASE_URL + `/danhmuc/${current.id}/edit`, values);
          if (setEdit) setEdit({ isEdit: false, current: {} });
        } else {
          await postData(API_BASE_URL + `/danhmuc/create`, values);
          resetForm();
        }
        if (setLoad) setLoad((e) => e + 1);
        enqueueSnackbar(
          !isEdit ? 'Thêm danh mục thành công' : 'Cập nhật thành công!',
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

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Tên danh mục"
                  {...getFieldProps('dm_ten')}
                  error={Boolean(touched.dm_ten && errors.dm_ten)}
                  helperText={touched.dm_ten && errors.dm_ten}
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
