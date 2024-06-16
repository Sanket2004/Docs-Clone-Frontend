import React from "react";
import { FiDownload } from "react-icons/fi";

const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint} className="hide-on-print flex items-center justify-center bg-green-100 border-2 border-green-300 rounded-lg cursor-pointer h-8 w-8" >
      <FiDownload />
    </button>
  );
};

export default PrintButton;
