import React from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastLeft = (msg,type) => {
    if(type === "success"){
      toast.success(
        <p className="text-white tx-16 mb-0">Success: {`${msg}`}</p>,
        {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
          theme: 'colored'
        }
    );
    }else if(type === "Failed"){
      toast.error(
        <p className="text-white tx-16 mb-0">Warning: {`${msg}`}</p>,
        {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
          theme: 'colored'
        }
    );
  }else{
    toast.warn(
      <p className="text-white tx-16 mb-0">Warning: {`${msg}`}</p>,
      {
        position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: true,
        autoClose: 3000,
        theme: 'colored'
      }
    );
  }
}
