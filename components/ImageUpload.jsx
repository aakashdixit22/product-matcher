import { useState, useRef } from 'react';

export default function ImageUpload({ onSearch, loading }) {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('file');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const applyFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    applyFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile && !loading) onSearch(selectedFile, false);
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim() && !loading) onSearch(imageUrl.trim(), true);
  };

  const tabClass = (tab) =>
    `flex-1 py-4 px-6 text-center font-semibold transition-colors ${
      activeTab === tab
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        <button className={tabClass('file')} onClick={() => setActiveTab('file')}>
          Upload File
        </button>
        <button className={tabClass('url')} onClick={() => setActiveTab('url')}>
          Image URL
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'file' ? (
          <div>
            {/* Drag-and-drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`mb-5 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 rounded-lg object-contain mb-3"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
              <p className="text-sm text-gray-500">
                {selectedFile
                  ? selectedFile.name
                  : 'Drag & drop or click to choose an image'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP supported</p>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Searching…
                </span>
              ) : (
                'Search Similar Products'
              )}
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-3">
              Enter image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
            />

            {/* URL preview */}
            {imageUrl.trim() && (
              <div className="mb-5 flex justify-center">
                <img
                  src={imageUrl.trim()}
                  alt="URL preview"
                  className="max-h-48 rounded-lg object-contain border border-gray-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <button
              onClick={handleUrlSubmit}
              disabled={!imageUrl.trim() || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Searching…
                </span>
              ) : (
                'Search Similar Products'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}