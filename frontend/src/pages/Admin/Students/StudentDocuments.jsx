import React, { useState, useEffect } from "react";
import { uploadDocument } from "../../../api/uploadDoc.api";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DOC_TYPES = [
    { key: "aadhar", label: "Aadhar Card" },
    { key: "marksheet10", label: "10th Marksheet" },
    { key: "marksheet12", label: "12th Marksheet" }
];

const StudentDocuments = ({ studentId, documents }) => {

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [progress, setProgress] = useState({});
    const [uploading, setUploading] = useState({});
    const [thumbnails, setThumbnails] = useState({});

    // Generate thumbnail from PDF
    const generateThumbnailFromUrl = async (url, type) => {

        try {

            const pdf = await pdfjsLib.getDocument(url).promise;
            const page = await pdf.getPage(1);

            const viewport = page.getViewport({ scale: 1 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport
            }).promise;

            const image = canvas.toDataURL();

            setThumbnails(prev => ({
                ...prev,
                [type]: image
            }));

        } catch (err) {

            console.log("Thumbnail error:", err);

        }

    };

    // Load existing documents
    useEffect(() => {

        if (!documents) return;

        Object.entries(documents).forEach(([type, doc]) => {

            if (!doc?.url) return;

            setUploadedFiles(prev => ({
                ...prev,
                [type]: doc.fileName
            }));

            setProgress(prev => ({
                ...prev,
                [type]: 100
            }));

            generateThumbnailFromUrl(doc.url, type);

        });

    }, [documents]);

    // Generate thumbnail for uploaded file
    const generateThumbnail = async (file, type) => {

        const reader = new FileReader();

        reader.onload = async function () {

            const typedarray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const page = await pdf.getPage(1);

            const viewport = page.getViewport({ scale: 1 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport
            }).promise;

            const image = canvas.toDataURL();

            setThumbnails(prev => ({
                ...prev,
                [type]: image
            }));

        };

        reader.readAsArrayBuffer(file);

    };

    // Upload handler
    const handleUpload = async (e, type) => {

        if (!studentId) {
            alert("Student must be created first");
            return;
        }

        const file = e.target.files[0];
        if (!file) return;

        try {

            setUploading(prev => ({ ...prev, [type]: true }));

            await generateThumbnail(file, type);

            await uploadDocument(studentId, type, file, (event) => {

                if (!event.total) return;

                const percent = Math.round((event.loaded * 100) / event.total);

                setProgress(prev => ({
                    ...prev,
                    [type]: percent
                }));

            });

            setUploadedFiles(prev => ({
                ...prev,
                [type]: file.name
            }));

            setProgress(prev => ({
                ...prev,
                [type]: 100
            }));

        } catch (err) {

            console.log(err);

        } finally {

            setUploading(prev => ({
                ...prev,
                [type]: false
            }));

        }

    };

    const renderCard = (type, title) => (

        <div key={type} className="border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition">

            <p className="text-sm font-semibold text-slate-700 mb-3">
                {title}
            </p>

            {/* Thumbnail */}
            {thumbnails[type] && (
                <img
                    src={thumbnails[type]}
                    alt="document"
                    className="w-24 h-32 object-cover rounded border mx-auto mb-3"
                />
            )}

            {/* Upload */}
            <label
                htmlFor={type}
                className="border-2 border-dashed border-slate-300 rounded-lg p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition flex flex-col items-center"
            >

                <p className="text-xs text-slate-500">Upload PDF</p>

                <p className="text-xs text-indigo-500 font-medium mt-1">
                    Click to Upload
                </p>

            </label>

            <input
                id={type}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleUpload(e, type)}
            />

            {/* Upload Progress */}
            {uploading[type] && (

                <div className="mt-3">

                    <div className="w-full bg-slate-200 rounded h-2 overflow-hidden">

                        <div
                            className="bg-indigo-500 h-full transition-all"
                            style={{ width: `${progress[type] || 0}%` }}
                        />

                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                        Uploading {progress[type] || 0}%
                    </p>

                </div>

            )}

            {/* Uploaded */}
            {progress[type] === 100 && uploadedFiles[type] && (

                <div className="mt-3">

                    <div className="text-green-600 text-sm font-semibold">
                        ✔ Uploaded
                    </div>

                    <p className="text-xs text-slate-500 break-all">
                        {uploadedFiles[type]}
                    </p>

                    <div className="flex justify-center gap-2 mt-2">

                        <button
                            onClick={() => {
                                const url = documents[type];
                                if (!url) {
                                    alert("Document not available");
                                    return;
                                }
                                window.open(url, "_blank", "noopener,noreferrer");
                            }}
                            className="text-xs bg-indigo-500 text-white px-2 py-1 rounded"
                        >
                            Preview
                        </button>

                        <a
                            href={documentUrls[type]}
                            download={uploadedFiles[type] || "document.pdf"}
                            className="text-xs bg-slate-200 px-2 py-1 rounded"
                        >
                            Download
                        </a>

                    </div>

                </div>

            )}

        </div>

    );

    return (

        <div>

            <h3 className="text-sm font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">
                Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {DOC_TYPES.map(doc =>
                    renderCard(doc.key, doc.label)
                )}

            </div>

        </div>

    );

};

export default StudentDocuments;