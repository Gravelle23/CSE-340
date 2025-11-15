-- Assignment 2 - Task One

-- 1. Insert Tony Stark
INSERT INTO account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

-- 2. Make Tony an Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 4;  

-- 3. Delete Tony Stark
DELETE FROM account
WHERE account_id = 4;  

-- 4. Fix GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
  AND inv_model = 'Hummer';

-- 5. Inner join for Sport vehicles
SELECT
  i.inv_make,
  i.inv_model,
  c.classification_name
FROM inventory AS i
INNER JOIN classification AS c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Add "/vehicles" to image paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
