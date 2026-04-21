-- =========================
-- FIX: Disable & variable issue
-- =========================
SET DEFINE OFF;

-- =========================
-- CLEAN OLD DATA
-- =========================
DELETE FROM product_categories;
DELETE FROM products;
DELETE FROM categories;
COMMIT;

-- =========================
-- INSERT PRODUCTS
-- =========================

INSERT INTO products 
(id, name, description, price, image, calories, sale_type, unit, unit_weight, recommended, tags, created_at, updated_at)
VALUES 
('prod-1','Manuka Honey Gold','500+ MGO Certified',68,'https://...',300,'fixed','g',500,1,'["Organic","Premium"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO products 
VALUES 
('prod-2','Raw Almond Bliss','Sprouted, Organic',15,'https://...',450,'variable','kg',NULL,0,'["Fresh","Keto"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO products 
VALUES 
('prod-3','Greek Silk Yogurt','A2 Cultured Dairy',9.5,'https://...',120,'fixed','g',200,1,'["Local","Pure"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO products 
VALUES 
('prod-4','Kyoto Matcha Reserve','Shaded First Harvest',34,'https://...',5,'fixed','g',50,1,'["Japanese","Premium"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO products 
VALUES 
('prod-5','Pure Stevia Leaves','Sun-dried organic stevia',8.5,'https://...',0,'fixed','g',100,0,'["Natural","Sugar-Free"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO products 
VALUES 
('prod-6','Hearth Sourdough loaf','36-hour Fermentation',7.5,'https://...',250,'fixed','g',100,1,'["Artisanal","Freshly Baked"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO products 
VALUES 
('prod-7','Whole Milk','Creamy dairy milk',24,'https://...',220,'variable','L',NULL,1,'["Fresh","High Protein"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO products 
VALUES 
('prod-8','Garden Roma Tomatoes','Sweet tomatoes',4.25,'https://...',18,'fixed','g',500,0,'["Fresh","Produce"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO products 
VALUES 
('prod-9','Crisp Bell Peppers','Mixed peppers',5.5,'https://...',30,'fixed','g',300,0,'["Fresh","Vegetables"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

COMMIT;

-- =========================
-- INSERT CATEGORIES
-- =========================

INSERT INTO categories (name) VALUES ('Artisanal Bakery');
INSERT INTO categories (name) VALUES ('The Pantry');
INSERT INTO categories (name) VALUES ('Dairy & Eggs');
INSERT INTO categories (name) VALUES ('Meat & Seafood');
INSERT INTO categories (name) VALUES ('Sugar Free');
INSERT INTO categories (name) VALUES ('Protein Rich');
INSERT INTO categories (name) VALUES ('Fruits & Veggies');

COMMIT;

-- =========================
-- PRODUCT CATEGORY LINKS
-- =========================

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE c.name = 'Artisanal Bakery' AND p.id = 'prod-6';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE c.name = 'The Pantry' AND p.id IN ('prod-1','prod-2','prod-4','prod-5');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE c.name = 'Dairy & Eggs' AND p.id = 'prod-3';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE c.name = 'Meat & Seafood' AND p.id = 'prod-7';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE c.name = 'Sugar Free' AND p.id IN ('prod-1','prod-4','prod-5');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE c.name = 'Protein Rich' AND p.id IN ('prod-2','prod-3','prod-7');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE c.name = 'Fruits & Veggies' AND p.id IN ('prod-8','prod-9');

COMMIT;