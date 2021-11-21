import React from 'react';
import './Loader.scss';

const Loader = ({ text = '处理中' }) => (
  <div className="loading-component text-center">
    <div className="spinner-grow text-primary" role="status">
    </div>
    <h5 className="text-primary">{text}</h5>
  </div>
)

export default Loader;
