import React from "react";

const Loader = () => {
  return (
    <div className="loader-container">
      <style>
        {`
          .loader-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;
            z-index: 9999;
          }

          .loader {
            width: 4px;
            color: #000;
            aspect-ratio: 1;
            border-radius: 50%;
            box-shadow: 
              19px -19px 0 0px, 38px -19px 0 0px, 57px -19px 0 0px,
              19px 0     0 5px, 38px 0     0 5px, 57px 0     0 5px,
              19px 19px  0 0px, 38px 19px  0 0px, 57px 19px  0 0px;
            transform: translateX(-38px);
            animation: l26 2s infinite linear;
          }

          @keyframes l26 {
            12.5% {box-shadow: 
              19px -19px 0 0px, 38px -19px 0 0px, 57px -19px 0 5px,
              19px 0     0 5px, 38px 0     0 0px, 57px 0     0 5px,
              19px 19px  0 0px, 38px 19px  0 0px, 57px 19px  0 0px}
            25%   {box-shadow: 
              19px -19px 0 5px, 38px -19px 0 0px, 57px -19px 0 5px,
              19px 0     0 0px, 38px 0     0 0px, 57px 0     0 0px,
              19px 19px  0 0px, 38px 19px  0 5px, 57px 19px  0 0px}
            50%   {box-shadow: 
              19px -19px 0 5px, 38px -19px 0 5px, 57px -19px 0 0px,
              19px 0     0 0px, 38px 0     0 0px, 57px 0     0 0px,
              19px 19px  0 0px, 38px 19px  0 0px, 57px 19px  0 5px}
            62.5% {box-shadow: 
              19px -19px 0 0px, 38px -19px 0 0px, 57px -19px 0 0px,
              19px 0     0 5px, 38px 0     0 0px, 57px 0     0 0px,
              19px 19px  0 0px, 38px 19px  0 5px, 57px 19px  0 5px}
            75%   {box-shadow: 
              19px -19px 0 0px, 38px -19px 0 5px, 57px -19px 0 0px,
              19px 0     0 0px, 38px 0     0 0px, 57px 0     0 5px,
              19px 19px  0 0px, 38px 19px  0 0px, 57px 19px  0 5px}
            87.5% {box-shadow: 
              19px -19px 0 0px, 38px -19px 0 5px, 57px -19px 0 0px,
              19px 0     0 0px, 38px 0     0 5px, 57px 0     0 0px,
              19px 19px  0 5px, 38px 19px  0 0px, 57px 19px  0 0px}
          }

          .loading-text {
            margin-top: 40px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 12px;
            color: #333;
          }
        `}
      </style>
      <div className="loader"></div>
      <p className="loading-text">Synchronizing Data...</p>
    </div>
  );
};

export default Loader;