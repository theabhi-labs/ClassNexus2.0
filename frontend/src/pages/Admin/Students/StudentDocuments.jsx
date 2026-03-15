import React, { useState, useEffect } from "react";
import { uploadDocument } from "../../../api/uploadDoc.api";
import * as pdfjsLib from "pdfjs-dist";
import { FileText, UploadCloud, Eye, Download, CheckCircle, FileWarning } from "lucide-react"; // Install lucide-react
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DOC_TYPES = [
    { key: "aadhar", label: "Aadhar Card" },
    { key: "marksheet10", label: "10th Marksheet" },
    { key: "marksheet12", label: "12th Marksheet" }
];

const StudentDocuments = ({ studentId, documents }) => {
    const [uploadedFiles, setUploadedFiles] = useState({}); // Stores file names
    const [progress, setProgress] = useState({});
    const [uploading, setUploading] = useState({});
    const [thumbnails, setThumbnails] = useState({});

    // Helper: Truncate long file names
    const truncateName = (name) => {
        if (!name) return "";
        return name.length > 20 ? name.substring(0, 15) + "..." + name.split('.').pop() : name;
    };

    const generateThumbnailFromUrl = async (url, type) => {
        if (!url) return;
        try {
            const loadingTask = pdfjsLib.getDocument({ url, withCredentials: false });
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.3 });
            
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
            setThumbnails(prev => ({ ...prev, [type]: canvas.toDataURL() }));
        } catch (err) {
            setThumbnails(prev => ({ ...prev, [type]: "fallback" }));
        }
    };

    useEffect(() => {
        if (!documents) return;
        Object.entries(documents).forEach(([type, doc]) => {
            if (doc?.url) {
                setUploadedFiles(prev => ({ ...prev, [type]: doc.fileName || "Uploaded_Doc.pdf" }));
                setProgress(prev => ({ ...prev, [type]: 100 }));
                generateThumbnailFromUrl(doc.url, type);
            }
        });
    }, [documents]);

    const handleUpload = async (e, type) => {
        if (!studentId) return alert("Please save student details first!");
        const file = e.target.files[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [type]: true }));
        setUploadedFiles(prev => ({ ...prev, [type]: file.name }));

        try {
            // Instant local thumbnail preview logic here (same as your original)
            await uploadDocument(studentId, type, file, (event) => {
                const percent = Math.round((event.loaded * 100) / event.total);
                setProgress(prev => ({ ...prev, [type]: percent }));
            });
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const renderCard = (type, title) => {
        const currentUrl = documents?.[type]?.url;
        const fileName = uploadedFiles[type];
        const isDone = progress[type] === 100;
        const isUploading = uploading[type];

        return (
            <div key={type} className="group relative bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FileText size={20} />
                    </div>
                    {isDone && <CheckCircle size={18} className="text-emerald-500" />}
                </div>

                <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
                
                {/* File Name Display */}
                <p className="text-[11px] text-slate-400 mb-4 truncate italic">
                    {fileName ? truncateName(fileName) : "No file attached"}
                </p>

                {/* Thumbnail / Dropzone Area */}
                <div className="relative w-full aspect-[4/3] mb-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-200">
                    {thumbnails[type] && thumbnails[type] !== "fallback" ? (
                        <img src={thumbnails[type]} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            {isUploading ? (
                                <div className="animate-pulse flex flex-col items-center text-indigo-500">
                                    <UploadCloud size={32} className="animate-bounce" />
                                    <span className="text-[10px] font-bold">UPLOADING...</span>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={24} className="text-slate-300" />
                                    <span className="text-[10px] text-slate-400 font-medium">PDF ONLY</span>
                                </>
                            )}
                        </div>
                    )}
                    
                    {/* Overlay Upload Input */}
                    <input 
                        id={type} 
                        type="file" 
                        accept="application/pdf" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={(e) => handleUpload(e, type)} 
                    />
                </div>

                {/* Progress Bar */}
                {isUploading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 overflow-hidden rounded-t-2xl">
                        <div 
                            className="h-full bg-indigo-500 transition-all duration-300" 
                            style={{ width: `${progress[type]}%` }}
                        />
                    </div>
                )}

                {/* Modern Action Buttons */}
                {isDone && currentUrl && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                        <button
                            onClick={() => window.open(currentUrl, "_blank")}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-indigo-600 transition-colors"
                        >
                            <Eye size={14} /> View
                        </button>
                        <a
                            href={currentUrl}
                            download
                            className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <Download size={14} />
                        </a>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mt-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Student Documents</h3>
                    <p className="text-xs text-slate-500">Upload and manage official PDF records</p>
                </div>
                <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {Object.keys(uploadedFiles).length} / {DOC_TYPES.length} Uploaded
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {DOC_TYPES.map(doc => renderCard(doc.key, doc.label))}
            </div>
        </div>
    );
};

export default StudentDocuments;