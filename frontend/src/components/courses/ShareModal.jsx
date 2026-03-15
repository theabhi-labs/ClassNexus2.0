// components/ShareModal.jsx
import React, { useState } from "react";
import { 
  X, Copy, CheckCircle, Facebook, Twitter, Linkedin, Mail,
  Share2 
} from "lucide-react";

const ShareModal = ({ isOpen, onClose, course }) => {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(null);

  if (!isOpen) return null;

  const getShareUrl = () => {
    return window.location.href;
  };

  const getShareText = () => {
    return `Check out this course: ${course?.title} - ${course?.shortDescription}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setShareError("Failed to copy link");
      setTimeout(() => setShareError(null), 3000);
    });
  };

  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(getShareText());
    let shareUrl = '';

    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          shareUrl = `whatsapp://send?text=${text}%20${url}`;
        } else {
          shareUrl = `https://web.whatsapp.com/send?text=${text}%20${url}`;
        }
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(course?.title)}&body=${text}%20${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full sm:w-auto sm:min-w-[400px] rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Share this course</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Course Preview */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-6">
            <img 
              src={course?.thumbnail} 
              alt={course?.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{course?.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{course?.shortDescription}</p>
            </div>
          </div>

          {/* Copy Link */}
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-500 mb-2">Share link</p>
            <div className="flex gap-2">
              <input 
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-2 font-medium"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {shareError && (
              <p className="text-xs text-red-500 mt-2">{shareError}</p>
            )}
          </div>

          {/* Social Share Grid */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-3">Share on social media</p>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
              {/* WhatsApp */}
              <button
                onClick={() => shareOnSocial('whatsapp')}
                className="flex flex-col items-center gap-1 p-3 hover:bg-green-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.346.223-.643.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-600">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => shareOnSocial('facebook')}
                className="flex flex-col items-center gap-1 p-3 hover:bg-blue-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => shareOnSocial('twitter')}
                className="flex flex-col items-center gap-1 p-3 hover:bg-sky-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter className="w-6 h-6 text-sky-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">Twitter</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => shareOnSocial('linkedin')}
                className="flex flex-col items-center gap-1 p-3 hover:bg-blue-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin className="w-6 h-6 text-blue-700" />
                </div>
                <span className="text-xs font-medium text-slate-600">LinkedIn</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => shareOnSocial('telegram')}
                className="flex flex-col items-center gap-1 p-3 hover:bg-blue-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-600">Telegram</span>
              </button>

              {/* Email */}
              <button
                onClick={() => shareOnSocial('email')}
                className="flex flex-col items-center gap-1 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">Email</span>
              </button>
            </div>
          </div>

          {/* Mobile Native Share Hint */}
          {navigator.share && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center">
                💡 Tip: You can also use your phone's native share
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;