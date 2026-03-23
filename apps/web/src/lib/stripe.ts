import Stripe from 'stripe';

/** Stripe server-side client */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});
