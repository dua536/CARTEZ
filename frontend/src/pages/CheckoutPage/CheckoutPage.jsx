import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MapComponent from '../../components/Addresses/MapComponent/MapComponent';
import { fetchCart } from '../../store/CartPage/cartSlice';
import { selectCartItems } from '../../store/selectors';
import { productsService, addressesService, ordersService } from '../../api/services';
import { UNIT_SCALE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, TAX_RATE } from '../../constants/cart';
import styles from './CheckoutPage.module.css';

function getDefaultAddress(addresses) {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return null;
  }
  return addresses.find((address) => address.isDefault) || addresses[0];
}

const paymentMethods = [
  {
    id: 'cash',
    title: 'Cash on Delivery',
    description: 'Pay when your order arrives at your doorstep.',
    icon: 'payments',
  },
  {
    id: 'card',
    title: 'Card at Delivery',
    description: 'A quick tap or card swipe on delivery.',
    icon: 'credit_card',
  },
  {
    id: 'wallet',
    title: 'Digital Wallet',
    description: 'Use your preferred payment app at checkout.',
    icon: 'account_balance_wallet',
  },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [notes, setNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productsService.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Create a map of products by ID
  const productsById = {};
  products.forEach((product) => {
    productsById[product.id] = product;
  });

  // Create cart details with product information
  const cartDetails = cartItems
    .map((item) => ({ item, product: productsById[item.id] }))
    .filter((entry) => entry.product);

  // Calculate totals
  const subtotal = cartDetails.reduce((sum, { item, product }) => {
    const multiplier = product.saleType === 'variable' ? item.quantity / UNIT_SCALE : item.quantity;
    return sum + multiplier * product.price;
  }, 0);

  const shipping = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + shipping + taxes;

  useEffect(() => {
    let active = true;

    const loadAddresses = async () => {
      try {
        const loadedAddresses = await addressesService.list();
        if (!active) return;
        setAddresses(loadedAddresses);
        const defaultAddress = getDefaultAddress(loadedAddresses);
        setSelectedAddressId(defaultAddress?.id || null);
      } catch (error) {
        console.error('Failed to load addresses:', error);
        setAddresses([]);
      }
    };

    loadAddresses();

    return () => {
      active = false;
    };
  }, []);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) || getDefaultAddress(addresses),
    [addresses, selectedAddressId]
  );

  if (cartDetails.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className="material-symbols-outlined">shopping_cart</span>
        <h1>Your cart is empty</h1>
        <p>Add a few items before starting checkout.</p>
        <Link to="/" className={styles.primaryButton}>
          Continue Shopping
        </Link>
      </div>
    );
  }
  const handlePlaceOrder = async () => {
  if (!selectedAddressId) {
    setPlaceOrderError('Select address first');
    return;
  }

  try {
    setPlacingOrder(true);
    setPlaceOrderError('');
    await ordersService.placeOrder({
    addressId: selectedAddressId,
    paymentMethod: selectedPayment,
    deliveryNotes: notes || null,
  });


    await dispatch(fetchCart());
    navigate('/orders');
  } catch (error) {
    setPlaceOrderError(error?.message || 'Failed to place order.');
  } finally {
    setPlacingOrder(false);
  }
};


  return (
    <div className={styles.pageShell}>
      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>Karachi Delivery</span>
          <h1>Checkout</h1>
          <p>
            Review your order, choose a delivery address in Karachi, and complete your purchase in one clean flow.
          </p>
        </div>
        <Link to="/cart" className={styles.secondaryButton}>
          Back to Cart
        </Link>
      </section>

      <div className={styles.layout}>
        <section className={styles.mainColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Delivery Address</h2>
              <Link to="/addresses" className={styles.textLink}>
                Manage addresses
              </Link>
            </div>

            <div className={styles.addressGrid}>
              {addresses.map((address) => {
                const isActive = selectedAddressId === address.id;
                return (
                  <button
                    key={address.id}
                    type="button"
                    className={`${styles.addressCard} ${isActive ? styles.addressCardActive : ''}`}
                    onClick={() => setSelectedAddressId(address.id)}
                  >
                    <div className={styles.addressTopRow}>
                      <div>
                        <h3>{address.name}</h3>
                        {address.isDefault && <span className={styles.badge}>Default</span>}
                      </div>
                      <span className="material-symbols-outlined">{isActive ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                    </div>
                    <p>{address.fullAddress}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Delivery Notes</h2>
            </div>
            <textarea
              className={styles.notes}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add delivery instructions, landmark details, or timing preferences"
              rows={4}
            />
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Payment Method</h2>
            </div>
            <div className={styles.paymentGrid}>
              {paymentMethods.map((method) => {
                const isActive = selectedPayment === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    className={`${styles.paymentCard} ${isActive ? styles.paymentCardActive : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <span className="material-symbols-outlined">{method.icon}</span>
                    <div>
                      <h3>{method.title}</h3>
                      <p>{method.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside className={styles.sideColumn}>
          <div className={styles.summaryPanel}>
            <div className={styles.panelHeader}>
              <h2>Order Summary</h2>
            </div>

            <div className={styles.summaryList}>
              {cartDetails.map(({ product, item }) => {
                const quantityLabel = product.saleType === 'variable' ? `${item.quantity / UNIT_SCALE}${product.unit || ''}` : item.quantity;
                return (
                  <div key={product.id} className={styles.summaryItem}>
                    <div>
                      <h3>{product.name}</h3>
                      <p>Qty {quantityLabel}</p>
                    </div>
                    <span>${((product.saleType === 'variable' ? item.quantity / UNIT_SCALE : item.quantity) * product.price).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.totals}>
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</strong>
              </div>
              <div>
                <span>Taxes</span>
                <strong>${taxes.toFixed(2)}</strong>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            {selectedAddress && (
              <div className={styles.addressPreview}>
                <div className={styles.panelHeader}>
                  <h2>Map Preview</h2>
                </div>
                <MapComponent
                  latitude={selectedAddress.latitude}
                  longitude={selectedAddress.longitude}
                  editable={false}
                  height={280}
                />
                <p>{selectedAddress.fullAddress}</p>
              </div>
            )}

            {placeOrderError && (
              <p style={{ color: '#ffb4ab', marginBottom: '0.75rem', fontSize: '0.9rem' }} role="alert">
                {placeOrderError}
              </p>
            )}

            <button
              type="button"
              className={styles.placeOrderButton}
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              aria-busy={placingOrder}
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
