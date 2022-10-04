import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@material-ui/core';
// utils
// routes
//
import { getData, postData, putData } from 'src/_helper/httpProvider';
import { API_BASE_URL } from 'src/config/configUrl';
import { Icon } from '@iconify/react';
import { MIconButton } from 'src/components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

TheLoaiNewForm.propTypes = {
  isEdit: PropTypes.bool,
  current: PropTypes.object,
  id: PropTypes.string,
  setEdit: PropTypes.func,
  setLoad: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function TheLoaiNewForm({ isEdit, current, setEdit, setLoad }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [danhmucList, setDanhmucList] = useState();

  useEffect(() => {
    (async () => {
      const res = await getData(API_BASE_URL + '/danhmuc');
      setDanhmucList(res.data);
      console.log(res.data);
    })();
  }, []);

  const NewSchema = Yup.object().shape({
    tl_ten: Yup.string().required('Vui lòng nhập tên'),
    tl_iddm: Yup.string().required('Vui lòng chọn danh mục'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      tl_ten: current?.tl_ten || '',
      tl_iddm: current?.tl_iddm || '',
    },
    validationSchema: NewSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEdit) {
          await putData(API_BASE_URL + `/theloai/${current.id}/edit`, values);
          if (setEdit) setEdit({ isEdit: false, current: {} });
        } else {
          await postData(API_BASE_URL + `/theloai/create`, values);
          resetForm();
        }
        if (setLoad) setLoad((e) => e + 1);
        enqueueSnackbar(
          !isEdit ? 'Thêm thể loại thành công' : 'Cập nhật thành công!',
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
  const { errors, touched, handleSubmit, getFieldProps, values } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormControl>
                  <InputLabel id="dm-select">Danh mục</InputLabel>
                  <Select
                    error={Boolean(touched.tl_iddm && errors.tl_iddm)}
                    labelId="dm-select"
                    label="Danh mục"
                    {...getFieldProps('tl_iddm')}
                    values={values.tl_iddm}
                  >
                    {danhmucList?.map((dm) => (
                      <MenuItem key={dm.dm_id} value={dm.dm_id}>
                        {dm.dm_ten}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.tl_ten && errors.tl_ten && (
                    <>
                      <FormHelperText error>{errors.tl_iddm}</FormHelperText>
                    </>
                  )}
                </FormControl>
                <TextField
                  fullWidth
                  label="Tên thể loại"
                  {...getFieldProps('tl_ten')}
                  error={Boolean(touched.tl_ten && errors.tl_ten)}
                  helperText={touched.tl_ten && errors.tl_ten}
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
