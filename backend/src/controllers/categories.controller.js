const { query } = require('../../db');
const oracledb = require('oracledb');

function normalizeProductIds(productIds) {
  if (!productIds) return [];
  return productIds.split(',').filter(Boolean);
}

function formatCategory(category) {
  return {
    id: category.ID,
    name: category.NAME,
    productIds: normalizeProductIds(category.PRODUCTIDS),
  };
}

// ✅ GET ALL
exports.getCategories = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.id, c.name,
              LISTAGG(pc.product_id, ',') WITHIN GROUP (ORDER BY pc.product_id) AS productIds
       FROM categories c
       LEFT JOIN product_categories pc ON c.id = pc.category_id
       GROUP BY c.id, c.name
       ORDER BY c.name ASC`
    );

    res.json(result.map(formatCategory));
  } catch (error) {
    next(error);
  }
};

// ✅ GET BY ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT c.id, c.name,
              LISTAGG(pc.product_id, ',') WITHIN GROUP (ORDER BY pc.product_id) AS productIds
       FROM categories c
       LEFT JOIN product_categories pc ON c.id = pc.category_id
       WHERE c.id = :id
       GROUP BY c.id, c.name`,
      { id }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(formatCategory(result[0]));
  } catch (error) {
    next(error);
  }
};

// ✅ CREATE
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const result = await query(
      `INSERT INTO categories (name)
       VALUES (:name)
       RETURNING id INTO :id`,
      {
        name: name.trim(),
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      true
    );

    const insertedId = result.outBinds.id[0];

    res.status(201).json({
      id: insertedId,
      name: name.trim(),
      productIds: [],
    });
  } catch (error) {
    if (error.message.includes('unique')) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    next(error);
  }
};

// ✅ UPDATE
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const result = await query(
      `UPDATE categories SET name = :name WHERE id = :id`,
      { name: name.trim(), id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ id: Number(id), name: name.trim() });
  } catch (error) {
    if (error.message.includes('unique')) {
      return res.status(409).json({ message: 'Category name already exists' });
    }
    next(error);
  }
};

// ✅ DELETE
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM categories WHERE id = :id`,
      { id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};