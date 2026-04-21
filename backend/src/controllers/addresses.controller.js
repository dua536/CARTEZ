
const { query } = require('../../db');

function formatAddress(address) {
  return {
    ...address,
    isDefault: Boolean(address.IS_DEFAULT),
  };
}

exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const addresses = await query(
      `SELECT id, label, street_address, city, province, postal_code, 
              phone_number, delivery_instructions,
              country, latitude, longitude, is_default
       FROM addresses
       WHERE user_id = :userId
       ORDER BY is_default DESC, created_at DESC`,
      { userId }
    );

    res.json(addresses.map(formatAddress));
  } catch (error) {
    next(error);
  }
};

exports.getAddressById = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const addresses = await query(
      `SELECT id, label, street_address, city, province, postal_code,
              phone_number, delivery_instructions,
              country, latitude, longitude, is_default
       FROM addresses
       WHERE id = :id AND user_id = :userId`,
      { id, userId }
    );

    if (addresses.length === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(formatAddress(addresses[0]));
  } catch (error) {
    next(error);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const {
      label,
      street_address,
      city,
      province,
      postal_code,
      phone_number,
      delivery_instructions,
      country,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (!(street_address ?? req.body.streetAddress) || !city || !country){
      return res.status(400).json({
        message: 'Street address, city, and country are required',
      });
    }

    if (isDefault) {
      await query(
        `UPDATE addresses SET is_default = 0 WHERE user_id = :userId`,
        { userId }
      );
    }

    // ✅ FIXED RETURNING
    const result = await query(
      `INSERT INTO addresses 
       (user_id, label, street_address, city, province, postal_code, phone_number, delivery_instructions, country, latitude, longitude, is_default)
       VALUES (:userId, :label, :street, :city, :province, :postal, :phone, :instructions, :country, :lat, :lng, :isDefault)
       RETURNING id INTO :id`,
      {
        userId,
        label: label || null,
        street: street_address ?? req.body.streetAddress,
        city,
        province: province || null,
        postal: postal_code ?? req.body.postalCode ?? null,
        phone: phone_number ?? req.body.phoneNumber ?? null,
        instructions: delivery_instructions || null,
        country,
        lat: latitude || null,
        lng: longitude || null,
        isDefault: isDefault ? 1 : 0,
        id: { dir: 3003, type: 2 } // oracledb.BIND_OUT, NUMBER
      },
      true
    );

    const newId = result.outBinds.id[0];

    const newAddress = await query(
      `SELECT id, label, street_address, city, province, postal_code, 
              phone_number, delivery_instructions, country, latitude, longitude, is_default 
       FROM addresses 
       WHERE id = :id`,
      { id: newId }
    );

    res.status(201).json(formatAddress(newAddress[0]));
  } catch (error) {
    next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const existing = await query(
      `SELECT id FROM addresses WHERE id = :id AND user_id = :userId`,
      { id, userId }
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const {
      label,
      street_address,
      city,
      province,
      postal_code,
      phone_number,
      delivery_instructions,
      country,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (isDefault) {
      await query(
        `UPDATE addresses SET is_default = 0 WHERE user_id = :userId AND id != :id`,
        { userId, id }
      );
    }

    await query(
      `UPDATE addresses 
       SET label = :label, street_address = :street, city = :city, province = :province, postal_code = :postal,
           phone_number = :phone, delivery_instructions = :instructions, country = :country,
           latitude = :lat, longitude = :lng, is_default = :isDefault
       WHERE id = :id AND user_id = :userId`,
       {
        label: label ?? null,
        street: street_address ?? req.body.streetAddress ?? null,
        city: city ?? null,
        province: province ?? null,
        postal: postal_code ?? req.body.postalCode ?? null,
        phone: phone_number ?? req.body.phoneNumber ?? null,
        instructions: delivery_instructions ?? null,
        country: country ?? null,
        lat: latitude ?? null,
        lng: longitude ?? null,
        isDefault: isDefault ? 1 : 0,
        id,
        userId,
        }
      

    );

    const updatedAddress = await query(
      `SELECT id, label, street_address, city, province, postal_code,
              phone_number, delivery_instructions, country, latitude, longitude, is_default
       FROM addresses
       WHERE id = :id`,
      { id }
    );

    res.json(formatAddress(updatedAddress[0]));
  } catch (error) {
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const result = await query(
      `DELETE FROM addresses WHERE id = :id AND user_id = :userId`,
      { id, userId }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
};