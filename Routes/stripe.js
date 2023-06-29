const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Endpoint for creating a payment intent
router.post("/payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // ! payment intenet method communicates with the stripe Api server and returns a newly created payment intent object.
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    // on successful payment intent server responds containing client_secret unique identifier generated by stripe used on client side to confirm the payment.
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

module.exports = router;