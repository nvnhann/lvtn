import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton, MobileDatePicker } from '@material-ui/lab';
import {
  Box,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from '@material-ui/core';
// utils
// routes
//
import { useEffect, useState } from 'react';
import { getData, postData, putData } from '../../../_helper/httpProvider';
import { API_BASE_URL } from '../../../config/configUrl';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { formatDate } from '../../../_helper/formatDate';
import { MIconButton } from '../../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slices/user';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  id: PropTypes.string,
  isProfile: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function UserNewForm({ isEdit, currentUser, id, isProfile }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [reset, setReset] = useState(0);
  const dispatch = useDispatch();

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  function makePwd(length) {
    let result = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  useEffect(() => {
    (async () => {
      const _roles = await getData(API_BASE_URL + '/api/role');
      setRoles(_roles.data);
    })();
  }, []);

  const NewUserSchema = Yup.object().shape({
    showPassword: Yup.boolean(),
    showRole: Yup.boolean(),
    fullname: Yup.string().required('Vui l??ng nh???p h??? t??n'),
    email: Yup.string()
      .required('Vui l??ng nh???p ?????a ch??? email')
      .email('?????a ch??? email kh??ng h???p l???'),
    phone: Yup.string(),
    gender: Yup.string(),
    birthday: Yup.date(),
    role_id: Yup.string().when('showRole', {
      is: true,
      then: Yup.string().required('Vui l??ng ch???n quy???n'),
    }),
    credential: Yup.string().when('showPassword', {
      is: true,
      then: Yup.string()
        .min(8, 'M???t kh???u ??t nh???t 8 k?? t???!')
        .required('Vui l??ng nh???p m???t kh???u'),
    }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      showPassword: !isEdit,
      showRole: !isProfile,
      fullname: currentUser?.fullname || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      birthday: currentUser?.birthday || '2000-01-10',
      role_id: currentUser?.role_id || '3',
      credential: '',
      gender: currentUser?.gender || 'male',
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { resetForm, setFieldValue }) => {
      try {
        delete values.showPassword;
        delete values.showRole;
        values.birthday = formatDate(values.birthday);
        if (isEdit) {
          delete values.credential;
          await putData(API_BASE_URL + `/user/${id}/edit`, values);
          resetForm();
        } else {
          values.verify = true;
          await postData(API_BASE_URL + `/user/create`, values);
        }
        if (isProfile) {
          dispatch(login());
        }
        enqueueSnackbar(
          !isEdit ? 'T???o t??i kho???n th??nh c??ng' : 'C???p nh???t th??nh c??ng!',
          {
            variant: 'success',
          },
        );
        setFieldValue('credential', makePwd(8));
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
  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    setFieldValue,
  } = formik;

  useEffect(() => {
    (() => {
      setFieldValue('credential', makePwd(8));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);
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
                    label="H??? t??n"
                    {...getFieldProps('fullname')}
                    error={Boolean(touched.fullname && errors.fullname)}
                    helperText={touched.fullname && errors.fullname}
                  />
                  <TextField
                    fullWidth
                    label="S??? ??i???n tho???i"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Stack>

                <TextField
                  fullWidth
                  label="Email"
                  {...getFieldProps('email')}
                  disabled={isEdit}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 3, sm: 2 }}
                >
                  <MobileDatePicker
                    orientation="portrait"
                    label="Ng??y sinh"
                    value={values.birthday}
                    onChange={(value) => {
                      setFieldValue('birthday', value);
                    }}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} margin="normal" />
                    )}
                  />
                  <FormControl sx={{ width: '50%' }}>
                    <FormLabel id="gender-i">Gi???i t??nh</FormLabel>
                    <RadioGroup row {...getFieldProps('gender')}>
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="N???"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                {!isProfile && currentUser?.role_id !== 2 && (
                  <FormControl>
                    <InputLabel id="role-select">Quy???n</InputLabel>
                    <Select
                      labelId="role-select"
                      label="Quy???n"
                      {...getFieldProps('role_id')}
                      values={values.role}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.q_id} value={role.q_id}>
                          {role.q_vaitro}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {!isEdit && (
                  <TextField
                    label="M???t kh???u"
                    {...getFieldProps('credential')}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                          <IconButton onClick={() => setReset((e) => e + 1)}>
                            <Icon icon="ic:baseline-change-circle" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(touched.credential && errors.credential)}
                    helperText={touched.credential && errors.credential}
                  />
                )}

                <Box
                  sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
                >
                  <LoadingButton type="submit" variant="contained">
                    {!isEdit ? 'Th??m' : 'L??u'}
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
