import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';

function Navbar() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        if (e.target.value == null || "") {
            toast.error('Filename can not be empty !');
            return;
        }
        setTitle(e.target.value);
    };

    const handleCreateNewFile = () => {
        if (!title.trim()) {
            toast.error("Please enter a title for the file.");
            return;
        }

        const newDocumentId = uuidV4();
        navigate(`/documents/${newDocumentId}/${title}`);
        setShowModal(false); // Close the modal after creating the file
    };

    // Effect to toggle body class for scroll overflow
    useEffect(() => {
        if (showModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        // Cleanup function
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [showModal]);

    return (
        <>
            <Toaster position='top-center' />
            <nav className="bg-white border-gray-200 fixed w-full top-0">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to={'/'} className="flex items-center space-x-3">
                        <svg className='w-7 h-7' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H10M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V10M9 17H11.5M9 13H14M9 9H10M14 21L16.025 20.595C16.2015 20.5597 16.2898 20.542 16.3721 20.5097C16.4452 20.4811 16.5147 20.4439 16.579 20.399C16.6516 20.3484 16.7152 20.2848 16.8426 20.1574L21 16C21.5523 15.4477 21.5523 14.5523 21 14C20.4477 13.4477 19.5523 13.4477 19 14L14.8426 18.1574C14.7152 18.2848 14.6516 18.3484 14.601 18.421C14.5561 18.4853 14.5189 18.5548 14.4903 18.6279C14.458 18.7102 14.4403 18.7985 14.405 18.975L14 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0">
                        <button type="button" className="text-white bg-black hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-4 py-2 text-center" onClick={() => setShowModal(true)}>Create New File</button>
                    </div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white rounded-lg p-8 w-full max-w-[90%] sm:max-w-96">
                            <h2 className="text-lg font-semibold mb-4">Create New File</h2>
                            <input type="text" value={title} onChange={handleInputChange} placeholder="Enter file title" autoFocus className="border border-zinc-300 px-3 py-2 rounded-lg text-sm mb-4 w-full focus:border-black focus:outline-none" />
                            <div className="flex justify-end">
                                <button className="text-gray-600 ml-4 hover:text-gray-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-2" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="text-white bg-black hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-4 py-2" onClick={handleCreateNewFile}>Create</button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

export default Navbar;
