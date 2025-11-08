import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import './EnrollmentPopup.css';

import { loadStripe } from '@stripe/stripe-js';
import {
  Elements, CardElement, useStripe, useElements,
} from '@stripe/react-stripe-js';
import SuccessPopup from './SuccessPopup';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  || 'pk_test_51SG0nUAPFNUQuK4rnMkDK8DOCo9qWGCTPnpEMkI9AxofYvpEMBOPpM8FT8hOYf2x1uLc2FbKMgXheCnBoiUVoz3b00bKIxFIPB';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function EnrollmentForm({
  onClose,
  course,
  defaultUser,
  onSubmit,
  userToken,
  courseId,
  paymentsBaseUrl,
  authHeader,
  authScheme,
  useCookieSession,
  currentUserEndpoint,
}) {
  const dialogRef = useRef(null);
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState(defaultUser?.email || '');
  const [nameOnCard, setNameOnCard] = useState(defaultUser?.name || '');
  const [country, setCountry] = useState('US');
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [currentUser, setCurrentUser] = useState(defaultUser);

  const price = typeof course?.price === 'number' && !Number.isNaN(course.price)
    ? course.price
    : 99;

  const resolveToken = useCallback(() => (
    sessionStorage.getItem('auth_token')
    || localStorage.getItem('auth_token')
    || localStorage.getItem('accessToken')
    || (userToken && String(userToken).trim())
    || ''
  ), [userToken]);

  const canSubmitNow = !!(stripe && elements);

  useEffect(() => {
    setEmail(defaultUser?.email || '');
    setNameOnCard(defaultUser?.name || '');
    setErrMsg('');

    const to = setTimeout(() => {
      dialogRef.current?.querySelector('input, button, select')?.focus();
    }, 0);

    const onEsc = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onEsc);

    return () => {
      clearTimeout(to);
      window.removeEventListener('keydown', onEsc);
    };
  }, [defaultUser, onClose]);

  // Fetch current user to prefill form
  useEffect(() => {
    const token = resolveToken();
    if (!token) {
      // no token, do nothing
      return undefined; // explicitly return undefined to satisfy ESLint
    }

    const controller = new AbortController();

    const fetchCurrentUser = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch(`${paymentsBaseUrl}${currentUserEndpoint}`, {
          method: 'GET',
          headers,
          signal: controller.signal,
        });

        if (!res.ok) return;

        const u = await res.json();
        if (u?.id) {
          const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim();
          setCurrentUser({ id: u.id, name: fullName, email: u.email });
          setEmail(u.email || '');
          setNameOnCard(fullName);
        }
      } catch {
        // ignore errors
      }
    };

    fetchCurrentUser();

    return () => controller.abort();
  }, [paymentsBaseUrl, currentUserEndpoint, resolveToken]);

  const ids = {
    email: 'enroll-email',
    name: 'enroll-name-on-card',
    country: 'enroll-country',
    zip: 'enroll-zip',
    cardLabel: 'card-info-label',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleOverlayKeyDown = (e) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClose?.();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');

    if (!canSubmitNow) { setErrMsg('Payment not ready. Try again.'); return; }
    if (!email || !nameOnCard) { setErrMsg('Please fill all required fields.'); return; }
    if (!(courseId ?? course?.id)) { setErrMsg('Missing course_id.'); return; }

    try {
      setLoading(true);
      const amountCents = Math.round(Number(price) * 100);
      const body = {
        course_id: courseId ?? course?.id,
        amount: amountCents,
        student_id: currentUser?.id,
      };

      const token = resolveToken();
      const headers = { 'Content-Type': 'application/json' };
      if (!useCookieSession && token) headers[authHeader] = authScheme ? `${authScheme} ${token}` : token;

      const response = await fetch(`${paymentsBaseUrl}/payments/create_payment_intent`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        ...(useCookieSession ? { credentials: 'include' } : {}),
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      const clientSecret = data?.client_secret;
      if (!clientSecret) throw new Error('Missing client_secret.');

      const card = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: nameOnCard, email, address: { country, postal_code: zip } },
        },
      });

      if (error) { setErrMsg(error.message || 'Payment failed.'); return; }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm enrollment with backend
        const confirmResponse = await fetch(`${paymentsBaseUrl}/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ course_id: courseId ?? course?.id, student_id: currentUser.id }),
        });

        const confirmData = await confirmResponse.json();

        if (!confirmResponse.ok) {
          // Enrollment failed - show error
          const errorMessage = confirmData.error
            || confirmData.errors?.join(', ')
            || 'Failed to enroll in course. Please contact support.';
          setErrMsg(errorMessage);
          return;
        }

        // Enrollment successful - dispatch event and trigger callbacks
        window.dispatchEvent(new CustomEvent('enrollment-success', {
          detail: {
            courseId: courseId ?? course?.id,
            courseName: course?.course_name,
          },
        }));

        // Trigger onSubmit callback
        onSubmit?.({
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          courseId: courseId ?? course?.id,
          courseName: course?.course_name,
          email,
        });

        onClose?.();
      } else { setErrMsg(`Payment status: ${paymentIntent?.status || 'unknown'}`); }
    } catch (err) { setErrMsg(err?.message || 'Unexpected error.'); } finally { setLoading(false); }
  };

  return (
    <div
      className="enroll-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      role="button"
      aria-label="Close enrollment dialog"
      tabIndex={0}
    >
      <div
        className="enroll-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-title"
      >
        <button className="enroll-close" onClick={onClose} aria-label="Close" type="button">×</button>

        <div className="enroll-header">
          <h2 id="enroll-title">{course?.course_name || 'Online Course'}</h2>
          <div className="enroll-price">
            $
            {price.toFixed(2)}
          </div>
        </div>

        <form className="enroll-form" onSubmit={handleSubmit}>
          <label className="enroll-label" htmlFor={ids.email}>
            <span>Email</span>
            <input
              id={ids.email}
              type="email"
              placeholder="alex.wilson@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <div className="enroll-label">
            <span id={ids.cardLabel}>Card information</span>
            <div className="enroll-cardbox" role="group" aria-labelledby={ids.cardLabel}>
              <CardElement
                id="card-element"
                options={{ hidePostalCode: true, style: { base: { fontSize: '16px' }, invalid: { color: '#e5424d' } } }}
              />
            </div>
          </div>

          <label className="enroll-label" htmlFor={ids.name}>
            <span>Name on card</span>
            <input
              id={ids.name}
              type="text"
              placeholder="Alex Wilson"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              required
            />
          </label>

          <div className="enroll-row">
            <label className="enroll-label" htmlFor={ids.country}>
              <span>Country or region</span>
              <select id={ids.country} value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="MK">North Macedonia</option>
                <option value="SI">Slovenia</option>
                <option value="RS">Serbia</option>
                <option value="AL">Albania</option>
                <option value="GR">Greece</option>
              </select>
            </label>

            <label className="enroll-label" htmlFor={ids.zip}>
              <span>ZIP</span>
              <input id={ids.zip} type="text" placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
            </label>
          </div>

          {errMsg && <div className="enroll-error" role="alert">{errMsg}</div>}

          <button type="submit" className="enroll-submit" disabled={loading || !canSubmitNow}>
            {loading ? 'Processing…' : `Pay $${price.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

EnrollmentForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    course_name: PropTypes.string,
    price: PropTypes.number,
  }),
  defaultUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  userToken: PropTypes.string,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paymentsBaseUrl: PropTypes.string,
  authHeader: PropTypes.string,
  authScheme: PropTypes.string,
  useCookieSession: PropTypes.bool,
  currentUserEndpoint: PropTypes.string,
};

EnrollmentForm.defaultProps = {
  course: { course_name: 'Online Course', price: 99 },
  defaultUser: { name: '', email: '' },
  onSubmit: () => {},
  userToken: '',
  courseId: undefined,
  paymentsBaseUrl: 'http://localhost:3000',
  authHeader: 'Authorization',
  authScheme: 'Bearer',
  useCookieSession: false,
  currentUserEndpoint: '/current_user',

};

export default function EnrollmentPopup({
  isOpen,
  onClose,
  course,
  defaultUser,
  onSubmit,
  userToken,
  courseId,
  paymentsBaseUrl,
  authHeader,
  authScheme,
  useCookieSession,
  currentUserEndpoint,
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleSuccess = () => setShowSuccess(true);
    window.addEventListener('payment-success', handleSuccess);
    return () => window.removeEventListener('payment-success', handleSuccess);
  }, []);

  if (!isOpen && !showSuccess) return null;

  return (
    <>
      {isOpen && (
        <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
          <EnrollmentForm
            onClose={onClose}
            course={course}
            defaultUser={defaultUser}
            onSubmit={(data) => {
              const event = new CustomEvent('payment-success', { detail: data });
              window.dispatchEvent(event);
              onSubmit?.(data);
            }}
            userToken={userToken}
            courseId={courseId}
            paymentsBaseUrl={paymentsBaseUrl}
            authHeader={authHeader}
            authScheme={authScheme}
            useCookieSession={useCookieSession}
            currentUserEndpoint={currentUserEndpoint}
          />
        </Elements>
      )}

      {showSuccess && (
        <SuccessPopup
          onClose={() => {
            setShowSuccess(false);
            onClose?.();
          }}
        />
      )}
    </>
  );
}

EnrollmentPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    course_name: PropTypes.string,
    price: PropTypes.number,
  }),
  defaultUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  userToken: PropTypes.string,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paymentsBaseUrl: PropTypes.string,
  authHeader: PropTypes.string,
  authScheme: PropTypes.string,
  useCookieSession: PropTypes.bool,
  currentUserEndpoint: PropTypes.string,
};

EnrollmentPopup.defaultProps = {
  course: { course_name: 'Online Course', price: 99 },
  defaultUser: { name: '', email: '' },
  onSubmit: () => {},
  userToken: '',
  courseId: undefined,
  paymentsBaseUrl: 'http://localhost:3000',
  authHeader: 'Authorization',
  authScheme: 'Bearer',
  useCookieSession: false,
  currentUserEndpoint: '/current_user',
};
