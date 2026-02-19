import { useState } from 'react';
import Head from 'next/head';
import ImageUpload from '../components/ImageUpload';
import ResultsGrid from '../components/ResultsGrid';

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (imageData, isUrl = false) => {
    setLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      let formData = new FormData();
      
      if (isUrl) {
        formData.append('imageUrl', imageData);
        setUploadedImage(imageData);
      } else {
        formData.append('image', imageData);
        setUploadedImage(URL.createObjectURL(imageData));
      }

      const response = await fetch('/api/search', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>Visual Product Matcher</title>
        <meta name="description" content="Find visually similar products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Visual Product Matcher
          </h1>
          <p className="text-xl text-gray-600">
            Upload an image to find visually similar products
          </p>
        </div>

        <ImageUpload onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Searching for similar products...</p>
          </div>
        )}

        {uploadedImage && !loading && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Uploaded Image
            </h2>
            <div className="bg-white rounded-lg shadow-md p-4 inline-block">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="max-w-md max-h-64 rounded-lg"
              />
            </div>
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Top 5 Similar Products
            </h2>
            <ResultsGrid products={searchResults} />
          </div>
        )}

        {searchResults && searchResults.length === 0 && !loading && (
          <div className="mt-12 text-center p-8 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800 text-lg">
              No similar products found. Try a different image.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
