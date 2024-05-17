import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { Link, useLocation, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const SAVE_INTERVAL_MS = 2000; // Save every 2 seconds

const TOOLBAR_OPTIONS = [
    [{ header: [false, 1, 2, 3, 4, 5, 6] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

export default function TextEditor() {
    const { id: documentId, title: filename } = useParams();
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const [username, setUsername] = useState('');
    const [documents, setDocuments] = useState([]);


    useEffect(() => {
        const s = io(process.env.REACT_APP_SERVER_URL);
        setSocket(s);

        return () => {
            s.disconnect(true);
        };
    }, []);



    useEffect(() => {
        if (filename == null) {
            toast.error('No Such URL Found !')
        }

        if (!socket || !quill) return;

        socket.once("load-document", document => {
            quill.setContents(document);
            quill.enable();
        });

        socket.emit('get-document', documentId, username, filename);
    }, [socket, quill, documentId, username, filename]);

    useEffect(() => {
        if (!socket || !quill) return;

        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents());
        }, SAVE_INTERVAL_MS);

        return () => {
            clearInterval(interval);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (!socket || !quill) return;

        const handler = delta => {
            quill.updateContents(delta);
        };
        socket.on('receive-changes', handler);

        return () => {
            socket.off('receive-changes', handler);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (!socket || !quill) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            socket.emit("send-changes", delta);
        };
        quill.on('text-change', handler);

        return () => {
            quill.off('text-change', handler);
        };
    }, [socket, quill]);

    const wrapperRef = useCallback(wrapper => {
        if (!wrapper) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS },
        });
        q.disable(true);
        q.setText("Loading..");
        setQuill(q);
    }, []);

    const handleCopy = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            // Show some feedback that the URL has been copied
            toast.success('URL copied to clipboard!');
        }).catch((error) => {
            toast.error('Failed to copy URL: ', error);
            console.error('Failed to copy URL: ', error);
            // Optionally, you can provide some fallback mechanism or error handling
        });
    }

    return (
        <>
            <Toaster position='top-center' />
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="header">
                    <div className="flex">
                        <Link to={'/'}>
                            <h1 className="font-black text-xl lg:text-2xl">
                                Doc<span className='text-yellow-500'> Sync</span>
                            </h1>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center bg-zinc-100 rounded-lg cursor-pointer py-1" onClick={handleCopy}>
                        <h1 className='px-4 text-sm lg:text-normal'>{filename}</h1>
                        <svg className='w-6 h-6 lg:w-8 lg:w-8 mr-2' fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M16.5 2.25C14.7051 2.25 13.25 3.70507 13.25 5.5C13.25 5.69591 13.2673 5.88776 13.3006 6.07412L8.56991 9.38558C8.54587 9.4024 8.52312 9.42038 8.50168 9.43939C7.94993 9.00747 7.25503 8.75 6.5 8.75C4.70507 8.75 3.25 10.2051 3.25 12C3.25 13.7949 4.70507 15.25 6.5 15.25C7.25503 15.25 7.94993 14.9925 8.50168 14.5606C8.52312 14.5796 8.54587 14.5976 8.56991 14.6144L13.3006 17.9259C13.2673 18.1122 13.25 18.3041 13.25 18.5C13.25 20.2949 14.7051 21.75 16.5 21.75C18.2949 21.75 19.75 20.2949 19.75 18.5C19.75 16.7051 18.2949 15.25 16.5 15.25C15.4472 15.25 14.5113 15.7506 13.9174 16.5267L9.43806 13.3911C9.63809 12.9694 9.75 12.4978 9.75 12C9.75 11.5022 9.63809 11.0306 9.43806 10.6089L13.9174 7.4733C14.5113 8.24942 15.4472 8.75 16.5 8.75C18.2949 8.75 19.75 7.29493 19.75 5.5C19.75 3.70507 18.2949 2.25 16.5 2.25ZM14.75 5.5C14.75 4.5335 15.5335 3.75 16.5 3.75C17.4665 3.75 18.25 4.5335 18.25 5.5C18.25 6.4665 17.4665 7.25 16.5 7.25C15.5335 7.25 14.75 6.4665 14.75 5.5ZM6.5 10.25C5.5335 10.25 4.75 11.0335 4.75 12C4.75 12.9665 5.5335 13.75 6.5 13.75C7.4665 13.75 8.25 12.9665 8.25 12C8.25 11.0335 7.4665 10.25 6.5 10.25ZM16.5 16.75C15.5335 16.75 14.75 17.5335 14.75 18.5C14.75 19.4665 15.5335 20.25 16.5 20.25C17.4665 20.25 18.25 19.4665 18.25 18.5C18.25 17.5335 17.4665 16.75 16.5 16.75Z" fill="#000000"></path> </g></svg>
                    </div>
                </div>
                <div className='container' ref={wrapperRef}></div>
            </div>
        </>
    );
}
