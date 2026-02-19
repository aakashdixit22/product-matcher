import formidable from 'formidable';
import fs from 'fs';
import connectDB from '../../lib/mongodb';
import Product from '../../models/Product';
import { generateEmbedding, generateEmbeddingFromUrl, findSimilarProducts } from '../../lib/embeddings';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);

    let embedding;

    // Check if image URL was provided
    if (fields.imageUrl && fields.imageUrl[0]) {
      const imageUrl = fields.imageUrl[0];
      console.log('Generating embedding from URL:', imageUrl);
      embedding = await generateEmbeddingFromUrl(imageUrl);
    }
    // Check if file was uploaded
    else if (files.image && files.image[0]) {
      const file = files.image[0];
      console.log('Generating embedding from file:', file.filepath);
      const imageBuffer = fs.readFileSync(file.filepath);
      embedding = await generateEmbedding(imageBuffer);
      
      // Clean up uploaded file
      fs.unlinkSync(file.filepath);
    } else {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Get all products from database
    const allProducts = await Product.find({});

    if (allProducts.length === 0) {
      return res.status(404).json({ 
        error: 'No products in database. Please seed the database first.',
        results: []
      });
    }

    // Find similar products (top 5)
    const similarProducts = findSimilarProducts(embedding, allProducts, 5);

    console.log(`Found ${similarProducts.length} similar products`);

    return res.status(200).json({
      results: similarProducts,
      count: similarProducts.length,
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Failed to search for similar products',
      message: error.message
    });
  }
}
