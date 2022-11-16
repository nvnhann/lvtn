import { useState } from 'react';
// material
import { Box, Step, Paper, Button, Stepper, StepLabel, Typography, StepContent } from '@material-ui/core';
import { formatDateTime } from 'src/_helper/formatDate';

// ----------------------------------------------------------------------

export default function HoaDonStepper({trang_thai}) {
  const [activeStep, setActiveStep] = useState(trang_thai.length+1);


  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical">
        {trang_thai?.map((step, index) => (
          <Step key={index}>
            <StepLabel optional={<> 
            <Typography>{formatDateTime(step.tt_ngaycapnhat)}</Typography>
            <Typography >
            {step.tt_trangthai === 1 && <Typography>Đã xác nhận bởi: <b>{step.fullname}</b></Typography>}
            {step.tt_trangthai === 2 && <Typography>Đã lấy hàng bởi: <b>{step.fullname}</b></Typography>}
            {step.tt_trangthai === 3 && <Typography>Đã giao hàng bởi: <b>{step.fullname}</b></Typography>}
            </Typography>
            </>}>
              {step.tt_trangthai === 0 && 'Chờ xác nhận'}
              {step.tt_trangthai === 1 && 'Đã xác nhận'}
              {step.tt_trangthai === 2 && 'Đã lấy hàng'}
              {step.tt_trangthai === 3 && 'Đã giao hàng'}
              {step.tt_trangthai === 4 && 'Đã hủy'}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
}
