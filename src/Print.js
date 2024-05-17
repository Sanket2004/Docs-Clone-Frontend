import React from 'react';

const PrintButton = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button onClick={handlePrint} className='hide-on-print'>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path stroke="#ffffff" strokeLinejoin="round" strokeWidth="2" d="M8 17H5a1 1 0 01-1-1v-5a2 2 0 012-2h12a2 2 0 012 2v5a1 1 0 01-1 1h-3M8 4h8v5H8V4zm0 11h8v4H8v-4z"></path> <circle cx="7" cy="12" r="1" fill="#ffffff"></circle> </g></svg>
        </button>
    );
};

export default PrintButton;
