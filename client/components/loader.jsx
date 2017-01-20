import React from 'react';

const Loader = () => {
  return (
    <div className="loader-component">
      <div className='container'>
        <div className='loader'>
          <div className='loader--dot'></div>
          <div className='loader--dot'></div>
          <div className='loader--dot'></div>
          <div className='loader--dot'></div>
          <div className='loader--dot'></div>
          <div className='loader--dot'></div>
          <div className='loader--text'></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;