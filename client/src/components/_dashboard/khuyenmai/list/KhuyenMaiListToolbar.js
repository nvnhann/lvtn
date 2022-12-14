import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { styled, useTheme } from '@material-ui/core/styles';
import {
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { API_BASE_URL } from '../../../../config/configUrl';
import { putData } from '../../../../_helper/httpProvider';
import { useSnackbar } from 'notistack5';
import { MIconButton } from '../../../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import { useState } from 'react';
import DialogConfirm from '../../DialogConfirm';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

KhuyenMaiListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  setLoad: PropTypes.func,
  setSelected: PropTypes.func,
};
// ----------------------------------------------------------------------
export default function KhuyenMaiListToolbar({
  selected,
  filterName,
  onFilterName,
  setLoad,
  setSelected,
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const numSelected = selected.length;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const funcHidden = async () => {
    try {
      await putData(API_BASE_URL + '/api/khuyenmai-active', {
        arrID: JSON.stringify(selected),
        active: !hidden,
      });
      setHidden((e) => !e);
      if (setLoad) setLoad((e) => e + 1);
      enqueueSnackbar('C???p nh???t th??nh c??ng', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <RootStyle
        sx={{
          ...(numSelected > 0 && {
            color: isLight ? 'primary.main' : 'text.primary',
            bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} h??ng ???????c ch???n
          </Typography>
        ) : (
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="T??m ki???m..."
            startAdornment={
              <InputAdornment position="start">
                <Box
                  component={Icon}
                  icon={searchFill}
                  sx={{ color: 'text.disabled' }}
                />
              </InputAdornment>
            }
          />
        )}

        {numSelected > 0 && !!hidden && (
          <Tooltip title="???n t???t c???">
            <IconButton onClick={() => handleClickOpen()}>
              <Icon icon="bxs:hide" />
            </IconButton>
          </Tooltip>
        )}

        {numSelected > 0 && !hidden && (
          <Tooltip title="???n t???t c???">
            <IconButton onClick={() => handleClickOpen()}>
              <Icon icon="bxs:show" />
            </IconButton>
          </Tooltip>
        )}
      </RootStyle>
      <DialogConfirm
        open={open}
        handleClose={handleClose}
        message={
          <Typography color="error" variant="h4" align="center">
            B???n ch???c ch???n mu???n {!!hidden ? '???n' : 'hi???n'} c??c khuy???n m??i?
          </Typography>
        }
        excFunc={funcHidden}
      />
    </>
  );
}
