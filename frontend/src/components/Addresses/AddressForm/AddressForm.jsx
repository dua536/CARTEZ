import { useState } from 'react';
import MapComponent from '../MapComponent/MapComponent';
import styles from './AddressForm.module.css';

export default function AddressForm({ address, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => ({
    id: address?.id,
    name: address?.name || '',
    type: address?.type || 'home',
    street: address?.street || '',
    city: address?.city || 'Karachi',
    state: address?.state || 'Sindh',
    zipCode: address?.zipCode || '',
    phoneNumber: address?.phoneNumber || '',
    instructions: address?.instructions || '',
    latitude: address?.latitude || 24.8607,
    longitude: address?.longitude || 67.0011,
    isDefault: address?.isDefault || false,
  }));

  const [errors, setErrors] = useState({});

  const addressTypeOptions = [
    { value: 'home', label: 'Home', icon: 'home' },
    { value: 'work', label: 'Work', icon: 'work' },
    { value: 'gym', label: 'Gym', icon: 'fitness_center' },
    { value: 'school', label: 'School', icon: 'school' },
    { value: 'palette', label: 'Other', icon: 'palette' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Address name is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMapSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const fullAddress = `${formData.street}\n${formData.city}, ${formData.state} ${formData.zipCode}`;
      console.log("SAVING:", formData);
      onSave({ ...formData, fullAddress });
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2>{address ? 'Edit Address' : 'Add New Address'}</h2>
        <button onClick={onCancel} className={styles.closeBtn}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Address Name and Type */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="name">
              <span>Address Label</span>
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Home, Office, Parents"
              className={errors.name ? styles.inputError : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="type">Address Type</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange}>
              {addressTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address Fields */}
        <div className={styles.field}>
          <label htmlFor="street">
            <span>Street Address</span>
            {errors.street && <span className={styles.error}>{errors.street}</span>}
          </label>
          <input
            id="street"
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street address"
            className={errors.street ? styles.inputError : ''}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="city">
              <span>City</span>
              {errors.city && <span className={styles.error}>{errors.city}</span>}
            </label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className={errors.city ? styles.inputError : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="state">
              <span>State/Province</span>
              {errors.state && <span className={styles.error}>{errors.state}</span>}
            </label>
            <input
              id="state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className={errors.state ? styles.inputError : ''}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="zipCode">
              <span>Postal Code</span>
              {errors.zipCode && <span className={styles.error}>{errors.zipCode}</span>}
            </label>
            <input
              id="zipCode"
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Postal code"
              className={errors.zipCode ? styles.inputError : ''}
            />
          </div>
        </div>

        {/* Contact & Instructions */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="phoneNumber">Phone Number (Optional)</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="instructions">Delivery Instructions (Optional)</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="e.g., Ring doorbell twice, leave at back gate, etc."
            rows="2"
          />
        </div>

        {/* Map Component */}
        <div className={styles.mapSection}>
          <label>Confirm Location on Map</label>
          <MapComponent
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationSelect={handleMapSelect}
            editable={true}
          />
        </div>

        {/* Default Address Checkbox */}
        <div className={styles.checkboxField}>
          <input
            id="isDefault"
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          <label htmlFor="isDefault">Set as default delivery address</label>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            {address ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </form>
    </div>
  );
}
