import React from 'react';
import './Loader.css';
function Loader() {
  return (
    <div className='back-blur'>
    <div className="payment-loader">
      <div className="pad">
        <div className="chip"></div>
        <div className="line line1"></div>
        <div className="line line2"></div>
      </div>
      <div className="loader-text">
        Please wait while payment is processing...
      </div>
    </div>
    </div>
  );
}

export default Loader;