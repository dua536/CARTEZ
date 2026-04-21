import { useState, useEffect } from 'react';
import AddressCard from '../../components/Addresses/AddressCard/AddressCard';
import AddressForm from '../../components/Addresses/AddressForm/AddressForm';
import MapComponent from '../../components/Addresses/MapComponent/MapComponent';
import { addressesService } from '../../api/services';
import styles from './AddressesPage.module.css';

function getDefaultAddress(addresses) {

  if (!Array.isArray(addresses) || addresses.length === 0) {
    return null;
  }
  return addresses.find((address) => address.isDefault) || addresses[0];
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAddresses = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedAddresses = await addressesService.list();
        setAddresses(loadedAddresses);
        setSelectedAddress(getDefaultAddress(loadedAddresses));
      } catch (err) {
        console.error('Error loading addresses:', err);
        setError('Failed to load addresses');
        setAddresses([]);
        setSelectedAddress(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAddresses();
  }, []);

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSaveAddress = async (addressData) => {
    try {
      setError(null);
      let savedAddress;
      
      if (editingAddress) {
        // Update existing address
        const updated = await addressesService.update(addressData.id, addressData);

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === updated.id ? updated : addr
          )
        );

        if (selectedAddress?.id === updated.id) {
          setSelectedAddress(updated);
        }

      } else {
        // Create new address
        savedAddress = await addressesService.create(addressData);
        setAddresses([...addresses, savedAddress]);
        setSelectedAddress((prev) => prev || savedAddress);
      }

      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address');
    }
  };

  const handleDeleteConfirm = (addressId) => {
    setDeleteConfirm(addressId);
  };

  const handleDelete = async (addressId) => {
    try {
      setError(null);
      await addressesService.remove(addressId);
      const newAddresses = addresses.filter((addr) => addr.id !== addressId);
      setAddresses(newAddresses);

      if (selectedAddress?.id === addressId) {
        setSelectedAddress(getDefaultAddress(newAddresses));
      }
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address');
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <span className="material-symbols-outlined" style={{ animation: 'spin 2s linear infinite' }}>
            location_on
          </span>
          <p>Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.modal} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Delete Address?</h3>
            <p>Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button onClick={() => setDeleteConfirm(null)} className={styles.cancelBtn}>
                Keep Address
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className={styles.modal} onClick={handleCancel}>
          <div className={styles.formModal} onClick={(e) => e.stopPropagation()}>
            <AddressForm
              address={editingAddress}
              onSave={handleSaveAddress}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <span className={styles.badge}>Delivery Locations</span>
            <h1 className={styles.title}>My Addresses</h1>
          </div>
          <p className={styles.subtitle}>
            Manage your delivery locations for a seamless experience.
          </p>
          {error && (
            <p className={styles.subtitle} role="alert" style={{ color: '#ffb4ab', marginTop: '0.5rem' }}>
              {error}
            </p>
          )}
        </div>
      </header>

      <div className={styles.content}>
        {/* Left Section - Address List */}
        <section className={styles.addressesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className="material-symbols-outlined">bookmark</span>
              Saved Locations
            </h2>
            <button onClick={handleAddNew} className={styles.addButton}>
              <span className="material-symbols-outlined">add_location</span>
              Add New Address
            </button>
          </div>

          <div className={styles.addressesList}>
            {addresses.length === 0 ? (
              <div className={styles.emptyState}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#69f6b8' }}>
                  location_on
                </span>
                <h3>No addresses yet</h3>
                <p>Add your first delivery address to get started</p>
                <button onClick={handleAddNew} className={styles.emptyAddButton}>
                  Add Address
                </button>
              </div>
            ) : (
              addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                  onSelect={handleSelectAddress}
                />
              ))
            )}
          </div>
        </section>

        {/* Right Section - Map Preview */}
        {selectedAddress && (
          <section className={styles.mapSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className="material-symbols-outlined">map</span>
                Location Preview
              </h2>
            </div>

            <div className={styles.mapPreview}>
              <div className={styles.addressDetails}>
                <div className={styles.addressHeader}>
                  <span className="material-symbols-outlined" style={{ color: '#69f6b8' }}>
                    {getIconForType(selectedAddress.type)}
                  </span>
                  <div>
                    <h3>{selectedAddress.name}</h3>
                    {selectedAddress.isDefault && <span className={styles.defaultBadge}>Default</span>}
                  </div>
                </div>

                <div className={styles.addressInfo}>
                  <div className={styles.infoItem}>
                    <span className="material-symbols-outlined">location_on</span>
                    <div className={styles.infoText}>
                      {selectedAddress.fullAddress.split('\n').map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  </div>

                  {selectedAddress.phoneNumber && (
                    <div className={styles.infoItem}>
                      <span className="material-symbols-outlined">call</span>
                      <span>{selectedAddress.phoneNumber}</span>
                    </div>
                  )}

                  {selectedAddress.instructions && (
                    <div className={styles.infoItem}>
                      <span className="material-symbols-outlined">info</span>
                      <span>{selectedAddress.instructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Component */}
              <div className={styles.mapContainer}>
                <MapComponent
                  latitude={selectedAddress.latitude}
                  longitude={selectedAddress.longitude}
                  editable={false}
                />
              </div>

              <button
                onClick={() => handleEdit(selectedAddress)}
                className={styles.editButton}
              >
                <span className="material-symbols-outlined">edit</span>
                Edit This Address
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function getIconForType(type) {
  const icons = {
    home: 'home',
    work: 'work',
    palette: 'palette',
    gym: 'fitness_center',
    school: 'school',
    other: 'location_on',
  };
  return icons[type] || 'location_on';
}
