const { query } = require('../../db');

// 🔹 Normalize tags (Oracle stores as string/CLOB)
function normalizeTags(tags) {
  if (!tags) return [];

  if (Array.isArray(tags)) return tags;

  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

// 🔹 Format product response
function formatProduct(product) {
  return {
    id: product.ID,
    name: product.NAME,
    description: product.DESCRIPTION,
    price: product.PRICE !== null ? Number(product.PRICE) : null,
    image: product.IMAGE,
    calories: product.CALORIES !== null ? Number(product.CALORIES) : null,
    saleType: product.saleType,
    unit: product.UNIT,
    unit_weight: product.UNIT_WEIGHT !== null ? Number(product.UNIT_WEIGHT) : null,
    recommended: product.RECOMMENDED === 1,
    tags: normalizeTags(product.TAGS),
  };
}

// ✅ GET ALL PRODUCTS
const getProducts = async (req, res, next) => {
  try {
    const products = await query(
      `SELECT
        id,
        name,
        description,
        price,
        image,
        calories,
        sale_type AS "saleType",
        unit,
        unit_weight,
        recommended,
        tags
      FROM products
      ORDER BY name ASC`
    );

    res.json(products.map(formatProduct));
  } catch (error) {
    next(error);
  }
};

// ✅ GET PRODUCT BY ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const products = await query(
      `SELECT
        id,
        name,
        description,
        price,
        image,
        calories,
        sale_type AS "saleType",
        unit,
        unit_weight,
        recommended,
        tags
      FROM products
      WHERE id = :id
      FETCH FIRST 1 ROWS ONLY`,
      { id }
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(formatProduct(products[0]));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
};