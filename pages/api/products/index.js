import connectDB from '../../../lib/mongodb';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await connectDB();

  // GET all products
  if (req.method === 'GET') {
    try {
      const products = await Product.find({}).select('-embedding').limit(100);
      return res.status(200).json({
        products,
        count: products.length,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  // POST create new product
  if (req.method === 'POST') {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
