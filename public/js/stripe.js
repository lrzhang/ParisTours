import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51RQb2tJyXjjnzMVE1RmzlMMmIyw5ypwvXjOqsQZOII68FxFNkR6OrbTST9gc0fZltPe9xUFAzEVfOHbCtPVMkiyW00q8OJbPNU'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', err);
  }
};
