import { forwardRef } from 'react';
import PropTypes from 'prop-types';
// material
import {
  Slide,
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@material-ui/core';

// ----------------------------------------------------------------------

DialogConfirm.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleClickOpen: PropTypes.func,
  excFunc: PropTypes.func,
};

// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

// ----------------------------------------------------------------------

export default function DialogConfirm({ open, handleClose, message, excFunc }) {
  const handleConfirm = async () => {
    await excFunc();
    handleClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-slide-title">Thông báo</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleConfirm();
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
