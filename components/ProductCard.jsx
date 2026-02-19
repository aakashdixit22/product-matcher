export default function ProductCard({ product }) {
  const similarityPercentage = (product.similarity * 100).toFixed(1);
  
  const getSimilarityColor = (similarity) => {
    if (similarity >= 0.8) return 'bg-green-500';
    if (similarity >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className={`absolute top-2 right-2 ${getSimilarityColor(product.similarity)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
          {similarityPercentage}%
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-500">{product.category}</p>
      </div>
    </div>
  );
}
