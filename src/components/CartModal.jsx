import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function CartModal({ cart, onClose }) {
  // Step 13 — ref on close button so we can focus it when modal opens
  const closeRef = useRef(null);

  // Step 13 — focus the close button the moment the modal mounts
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Close on Escape key — good UX + accessibility
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formattedTotal = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(total);

  // Step 13 — createPortal renders outside the App div, straight to document.body
  return createPortal(
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="modal" role="dialog" aria-modal="true" aria-label="Cart">
        <div className="modal-header">
          <h2 className="modal-title">Your Cart</h2>
          <button
            className="modal-close"
            ref={closeRef}           // Step 13 — focused on open
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="modal-empty">
            <p>Your cart is empty 🛒</p>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">× {item.qty}</span>
                  <span className="cart-item-price">
                    {new Intl.NumberFormat("en-RW", {
                      style: "currency",
                      currency: "RWF",
                      maximumFractionDigits: 0,
                    }).format(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="cart-total">
              <span>Total</span>
              <span>{formattedTotal}</span>
            </div>

            <button className="checkout-btn">Checkout</button>
          </>
        )}
      </div>
    </>,
    document.body   // Step 13 — portal target, escapes any parent overflow:hidden
  );
}

export default CartModal;