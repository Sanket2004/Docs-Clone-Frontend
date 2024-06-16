import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FiSearch, FiX } from "react-icons/fi";

function HomePage() {
  const [username, setUsername] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem("username");
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
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/documents`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      setDocuments(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching documents");
      console.error("Error fetching documents:", error);
      setLoading(false);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const inputUsername = e.target.username.value;
    setUsername(inputUsername);
    localStorage.setItem("username", inputUsername);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDocuments = documents.filter((doc) => {
    const filename = doc.filename || "";
    const createdBy = doc.createdBy || "";
    return (
      filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchTerm("");
  };

  return (
    <>
      <Toaster position="top-center" />
      {!username ? (
        <section className="bg-white min-h-screen flex justify-center items-center">
          <div className="min-h-screen gap-16 place-content-center py-10 px-8 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-8 lg:px-8">
            <div className="font-light text-gray-500 sm:text-lg">
              <h2 className="mb-4 text-4xl text-black font-[900]">
                Doc<span className="text-yellow-400">Sync</span>
              </h2>
              <p className="mb-4 text-neutral-500 font-normal">
                Collaborative Document Editing Platform.
              </p>
              <form onSubmit={handleUsernameSubmit} className="w-full my-8">
                <label
                  htmlFor="username"
                  className="text-xl font-semibold text-yellow-500"
                >
                  Enter your name
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Jhon Doe"
                  className="border-b-4 border-yellow-200 text-yellow-500 py-4 w-full font-bold text-3xl focus:ring-0 outline-none focus:border-yellow-300 transition-all placeholder:text-neutral-200 focus:placeholder:text-neutral-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#facc15bd] border-2 border-yellow-400 text-white px-4 py-3 rounded-md w-full mt-4 font-semibold tracking-wide text-sm"
                >
                  Get Started
                </button>
              </form>
            </div>
            <div className="gap-4 mt-8">
              <img
                className="w-full"
                src="/img/hero.jpg"
                alt="hero content 1"
              />
            </div>
          </div>
        </section>
      ) : (
        <>
          <Navbar />
          <section className="bg-white h-max">
            <div className="gap-16 items-center pt-32 px-8 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-24 lg:px-8">
              <div className="font-light text-gray-500 sm:text-lg">
                <h2 className="mb-4 font-[900] text-black text-3xl">
                  Hello,{" "}
                  <span className="text-yellow-400">
                    {username.split(" ")[0]}
                  </span>
                </h2>
                <p className="mb-4 font-normal">
                  DocSync is a powerful collaborative document editing platform
                  designed to streamline teamwork and enhance productivity. With
                  DocSync, multiple users can work on the same document
                  simultaneously, ensuring real-time updates and seamless
                  collaboration.
                </p>
              </div>
              <div className="gap-4 mt-8">
                <img
                  className="w-full"
                  src="/img/hero.jpg"
                  alt="hero content 1"
                />
              </div>
            </div>
            <div className="py-24 px-8 mx-auto max-w-screen-xl lg:py-8 lg:px-8">
              <div className="flex justify-between">
                <h3 className="w-max pb-2 border-yellow-400 text-xl font-black mb-4 border-b-4">
                  All Documents
                </h3>
                <button
                  onClick={toggleSearch}
                  className="bg-transparent text-xl text-yellow-400 rounded-lg transition-all"
                >
                  {showSearch ? <FiX /> : <FiSearch />}
                </button>
              </div>
              {showSearch && (
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by filename or creator..."
                  className="w-full py-4 mb-6 border-gray-300 shadow-sm border-b-2 outline-none focus:ring-0 focus:border-b-2 focus:border-yellow-400 transition-all"
                />
              )}
              {loading ? (
                <div className="py-4">
                  <div className="animate-pulse flex flex-col gap-2 mb-4">
                    <div className="bg-yellow-100 w-full h-5 max-w-screen-md rounded-md"></div>
                    <div className="bg-gray-100 w-full h-5 max-w-48 rounded-md"></div>
                  </div>
                  <div className="animate-pulse flex flex-col gap-2 mb-4">
                    <div className="bg-yellow-100 w-full h-5 max-w-screen-md rounded-md"></div>
                    <div className="bg-gray-100 w-full h-5 max-w-48 rounded-md"></div>
                  </div>
                  <div className="animate-pulse flex flex-col gap-2">
                    <div className="bg-yellow-100 w-full h-5 max-w-screen-md rounded-md"></div>
                    <div className="bg-gray-100 w-full h-5 max-w-48 rounded-md"></div>
                  </div>
                </div>
              ) : (
                <>
                  {filteredDocuments.length > 0 ? (
                    <ul className="space-y-4">
                      {filteredDocuments.map((doc, index) => (
                        <li
                          key={doc._id}
                          className="bg-white rounded-lg py-4 transition-shadow duration-300"
                        >
                          <Link
                            to={`/document/${doc._id}/`}
                            className="text-yellow-500"
                          >
                            <div className="flex gap-4 border-yellow-400 hover:border-b-4 pb-4 transition-all w-max">
                              <h1 className="text-2xl font-bold">{index + 1}.</h1>
                              <div>
                                <div className="flex flex-col">
                                  <div className="text-lg font-bold">
                                    {doc.filename}
                                  </div>
                                  <div className="text-sm text-gray-600 font-semibold">
                                    Created by {doc.createdBy}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2 bg-neutral-100 w-max px-2 py-1 rounded-full">
                                  {new Date(doc.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center mt-4">
                      No documents found.
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default HomePage;
