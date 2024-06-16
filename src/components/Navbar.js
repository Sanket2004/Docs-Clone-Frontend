import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
import { FiTerminal } from 'react-icons/fi';

function Navbar() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleCreateNewFile = async () => {
        
        if (!username.trim()) {
            toast.error("Please enter a username.");
            return;
        }

        if (!title.trim()) {
            toast.error("Please enter a title for the file.");
            return;
        }

        const newDocumentId = uuidV4();

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/document`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: newDocumentId,
                    username: username,
                    filename: title,
                }),
            });

            if (!response.ok) {
                toast.error('Failed to create document');
                throw new Error('Failed to create document');
            }

            const result = await response.json();
            console.log('Document created:', result);

            navigate(`/document/${newDocumentId}`);
            setShowModal(false); // Close the modal after creating the file
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSaveUsername = () => {
        localStorage.setItem('username', username);
    };

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

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
                    <FiTerminal className='text-2xl font-bold text-yellow-400' />
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0">
                        <button type="button" className="text-white bg-yellow-400 hover:bg-yellow-500 hover:scale-105 transition-all focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 text-center" onClick={() => setShowModal(true)}>Create New File</button>
                    </div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white rounded-lg p-8 w-full max-w-[90%] sm:max-w-96">
                            <h2 className="text-lg font-bold mb-4">Create New File</h2>
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                onBlur={handleSaveUsername}
                                placeholder="Enter username"
                                autoFocus
                                readOnly
                                className="font-normal border border-zinc-300 px-3 py-2 rounded-lg text-sm mb-4 w-full focus:border-yellow-400 focus:outline-none"
                            />
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="Enter file name"
                                className="font-normal border border-zinc-300 px-3 py-2 rounded-lg text-sm mb-4 w-full focus:border-yellow-400 focus:outline-none"
                            />
                            <div className="flex justify-end">
                                <button className="text-gray-600 ml-4 hover:text-gray-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-2" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 transition-all focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2" onClick={handleCreateNewFile}>Create</button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

export default Navbar;
