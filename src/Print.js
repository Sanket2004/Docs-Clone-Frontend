import React from "react";
import { FiDownload } from "react-icons/fi";

const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint} className="hide-on-print cursor-pointer h-10 w-10 flex items-center justify-center" >
      <FiDownload />
    </button>
  );
};

export default PrintButton;
