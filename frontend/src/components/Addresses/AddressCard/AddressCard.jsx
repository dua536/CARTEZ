import styles from './AddressCard.module.css';

export default function AddressCard({ address, onEdit, onDelete, onSelect }) {
  const getIconForType = (type) => {
    const icons = {
      home: 'home',
      work: 'work',
      palette: 'palette',
      gym: 'fitness_center',
      school: 'school',
      other: 'location_on'
    };
    return icons[type] || 'location_on';
  };

  return (
    <div className={styles.card} onClick={() => onSelect?.(address)}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            {getIconForType(address.type || 'home')}
          </span>
          <div className={styles.titleContent}>
            <h3 className={styles.name}>{address.name}</h3>
            {address.isDefault && <span className={styles.badge}>Default</span>}
          </div>
        </div>
        <div className={styles.actions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className={styles.actionBtn}
            title="Edit address"
            aria-label="Edit address"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            className={styles.actionBtn}
            title="Delete address"
            aria-label="Delete address"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.addressText}>
          {address.fullAddress.split('\n').map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
        {address.phoneNumber && (
          <div className={styles.detail}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              call
            </span>
            <span>{address.phoneNumber}</span>
          </div>
        )}
        {address.instructions && (
          <div className={styles.instructions}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              info
            </span>
            <span>{address.instructions}</span>
          </div>
        )}
      </div>
    </div>
  );
}
