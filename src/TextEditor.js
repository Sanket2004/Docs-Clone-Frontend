import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { FiShare2, FiUser } from "react-icons/fi";
import PrintButton from "./Print";

const SAVE_INTERVAL_MS = 2000; // Save every 2 seconds

const TOOLBAR_OPTIONS = [
  [{ header: [false, 1, 2, 3, 4, 5, 6] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"],
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
];

const TextEditor = () => {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [filename, setFilename] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [userCount, setUserCount] = useState(0); // Add state for user count
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/document/${documentId}`
        );
        setFilename(response.data.filename);
        setCreatedBy(response.data.createdBy);
      } catch (error) {
        toast.error("File Not Found !");
        navigate("/");
      }
    };

    fetchDocumentDetails();
  }, [documentId, navigate]);

  useEffect(() => {
    const s = io(process.env.REACT_APP_SERVER_URL);
    setSocket(s);

    return () => {
      s.disconnect(true);
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);

    socket.on("user-count", (count) => {
      setUserCount(count);
    });
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
      formats: [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "background",   // for text and background color options
        "script",
        "align",
        "code-block",
        "direction",
      ],
    });
    q.disable(false);
    setQuill(q);
  }, []);

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((error) => {
        toast.error("Failed to copy URL: ", error);
        console.error("Failed to copy URL: ", error);
      });
  };

  // Generate an array of user images for demonstration purposes
  const userImages = [
    "https://api.dicebear.com/9.x/thumbs/svg?seed=Peanut",
    "https://api.dicebear.com/9.x/thumbs/svg?seed=Milo",
    "https://api.dicebear.com/9.x/thumbs/svg?seed=Bubba",
    "https://api.dicebear.com/9.x/thumbs/svg?seed=Abby",
  ];

  const displayedUsers = userImages.slice(0, Math.min(userCount, 3));
  const extraCount = userCount > 3 ? userCount - 3 : 0;

  return (
    <>
      <Toaster position="top-center" />
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="header flex items-start justify-between">
          <div className="flex flex-col items-start">
            <Link to={"/"}>
              <h1 className="font-black text-xl lg:text-2xl">
                Doc
                <span className="text-yellow-400 hover:text-yellow-500 transition-all">
                  Sync
                </span>
              </h1>
            </Link>
            <h1 className=" text-md lg:text-normal border-b-4 border-yellow-200 py-0.5">
              {filename}
            </h1>
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            {/* <div className="flex items-center justify-center bg-blue-100 border-2 border-blue-300 rounded-lg cursor-pointer h-8 w-8 relative group">
              <FiUser className="text-blue-500 group-hover:text-blue-700" />

              Show createdBy on hover
              <div className="w-max z-50 hidden group-hover:block absolute bg-white shadow-md rounded-md p-2 text-sm top-full left-1/2 transform -translate-x-1/2 mt-2">
                {createdBy}
              </div>
            </div> */}
            {/* Display user count */}
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {displayedUsers.map((src, index) => (
                <img
                  key={index}
                  className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src={src}
                  alt={`User ${index + 1}`}
                />
              ))}
              {extraCount > 0 && (
                <div className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800">
                  +{extraCount}
                </div>
              )}
            </div>
            <div className="flex">
              <div className="flex items-center justify-center border-l-2 border-y-2 h-10 w-10 rounded-l-full overflow-hidden">
                <div
                  className="flex items-center justify-center cursor-pointer h-10 w-10"
                  onClick={handleCopy}
                >
                  <FiShare2 />
                </div>
              </div>
              <div className="flex items-center justify-center border-2 h-10 w-10 rounded-r-full">
                <PrintButton />
              </div>
            </div>
          </div>
        </div>
        <div className="container" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default TextEditor;
