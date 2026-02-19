import { useState } from 'react';

export default function ImageUpload({ onSearch, loading }) {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('file');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onSearch(selectedFile, false);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onSearch(imageUrl.trim(), true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex border-b">
        <button
          className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
            activeTab === 'file'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('file')}
        >
          Upload File
        </button>
        <button
          className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
            activeTab === 'url'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('url')}
        >
          Image URL
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'file' ? (
          <form onSubmit={handleFileUpload}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Choose an image file
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    cursor-pointer"
                />
              </div>
              {selectedFile && (
                <p className="mt-3 text-sm text-green-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Similar Products'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUrlSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Enter image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={!imageUrl.trim() || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Similar Products'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
