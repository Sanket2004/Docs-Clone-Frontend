import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function HomePage() {
    const [username, setUsername] = useState('');
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // Retrieve username from local storage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        // Fetch documents when component mounts
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/documents`);
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
            const data = await response.json();
            setDocuments(data);
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching documents');
            console.error('Error fetching documents:', error);
            setLoading(false);
        }
    };

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        const inputUsername = e.target.username.value;
        setUsername(inputUsername);
        localStorage.setItem('username', inputUsername);
    };


    return (
        <>
            <Toaster position='top-center' />
            {!username ? (
                <section className="bg-white min-h-screen flex justify-center items-center">
                    <div className="min-h-screen gap-16 place-content-center py-10 px-8 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-8 lg:px-8">
                        <div className="font-light text-gray-500 sm:text-lg">
                            <h2 className="mb-4 text-4xl text-black font-[900]">Doc<span className='text-yellow-500'>Sync</span></h2>
                            <p className="mb-4 text-black text-black font-[600] text-l sm:text-xl">Collaborative Document Editing Platform.</p>
                            <form onSubmit={handleUsernameSubmit} className='w-full'>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    className="border border-gray-300 rounded-md p-2 w-full text-black focus:ring-0 focus:outline-none focus:border-black "
                                    required
                                />
                                <button type="submit" className="bg-black text-white px-4 py-3 rounded-md w-full mt-4 font-semibold uppercase tracking-wide text-sm">Start</button>
                            </form>
                        </div>
                        <div className="gap-4 mt-8">
                            <img className="w-full" src="/img/hero.jpg" alt="hero content 1" />
                        </div>
                    </div>
                </section>
            ) : (
                <>
                    <Navbar />
                    <section className="bg-white min-h-screen">
                        <div className="min-h-screen gap-16 items-center pt-32 px-8 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-8 lg:px-8">
                            <div className="font-light text-gray-500 sm:text-lg">
                                <h2 className="mb-4 font-[900] text-black text-3xl">Hello, <span className='text-yellow-500'>{username.split(' ')[0]}</span></h2>
                                {/* <p className="mb-4 text-black font-[600] text-black text-l sm:text-xl">Collaborative Document Editing Platform.</p> */}
                                <p className="mb-4 ">
                                    DocSync is a powerful collaborative document editing platform designed to streamline teamwork and enhance productivity. With DocSync, multiple users can work on the same document simultaneously, ensuring real-time updates and seamless collaboration.
                                </p>
                            </div>
                            <div className="gap-4 mt-8">
                                <img className="w-full" src="/img/hero.jpg" alt="hero content 1" />
                            </div>
                        </div>
                        <div className="py-24 px-8 mx-auto max-w-screen-xl lg:py-8 lg:px-8">
                            <h3 className="text-xl font-bold mb-4">All Documents</h3>
                            {
                                loading ?
                                    <p>Loading documents..</p>
                                :
                                    <ul>
                                        {documents.map((doc) => (
                                            <li key={doc._id} className="mb-2">
                                                <Link to={`/documents/${doc._id}/${doc.filename}`} className="text-yellow-500 hover:underline">
                                                    {doc.filename} (Created on {new Date(doc.createdAt).toLocaleString()})
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                            }
                        </div>
                    </section>
                </>
            )}
        </>
    );
}

export default HomePage;
