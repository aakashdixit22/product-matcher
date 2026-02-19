import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Python API endpoint
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000';

// Generate embedding from image buffer
export async function generateEmbedding(imageBuffer) {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, 'image.jpg');
    
    const response = await axios.post(`${PYTHON_API_URL}/generate-embedding`, formData, {
      headers: formData.getHeaders(),
    });
    
    return response.data.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    throw error;
  }
}

// Generate embedding from image URL
export async function generateEmbeddingFromUrl(imageUrl) {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/generate-embedding`, {
      imageUrl: imageUrl,
    });
    
    return response.data.embedding;
  } catch (error) {
    console.error('Error generating embedding from URL:', error.message);
    throw error;
  }
}

// Generate embedding from file path
export async function generateEmbeddingFromFile(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    return await generateEmbedding(imageBuffer);
  } catch (error) {
    console.error('Error generating embedding from file:', error.message);
    throw error;
  }
}

// Batch generate embeddings from URLs
export async function batchGenerateEmbeddings(imageUrls) {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/batch-embeddings`, {
      imageUrls: imageUrls,
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Error batch generating embeddings:', error.message);
    throw error;
  }
}

// Calculate cosine similarity between two embeddings
export function cosineSimilarity(embedding1, embedding2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (norm1 * norm2);
}

// Find similar products based on embedding
export function findSimilarProducts(queryEmbedding, products, limit = 20) {
  const similarities = products.map(product => ({
    ...product.toObject(),
    similarity: cosineSimilarity(queryEmbedding, product.embedding),
  }));
  
  // Sort by similarity score (descending)
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  return similarities.slice(0, limit);
}
