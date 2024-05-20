import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
const SELLERTOKEN =
  "TEST-2599259819337333-051517-a52d30e59d30fe3588aac4adfc7a71fa-1815436864";


export class PaymentController {
  constructor() {}

  createOrder = async (req, res) => {
    const idempotencyKey = uuidv4().replace(/-/g, "").slice(0, 10);
    const client = new MercadoPagoConfig({
      accessToken: SELLERTOKEN,
      options: { timeout: 5000, idempotencyKey: idempotencyKey },
    });

    const preference = new Preference(client);
    const quantity = parseInt(req.body.hours);
    try {
      const p = await preference.create({
        body: {
          items: [
            {
              title: "Cloud Gaming",
              quantity: quantity,
              unit_price: 100,
            },
          ],
          purpose: "wallet_purchase",
          back_urls: {
            "success": "https://cloud-gaming-server.onrender.com/success",
            "pending": "https://cloud-gaming-server.onrender.com/pending",
            "failure": "https://cloud-gaming-server.onrender.com/success/failure"
        },
          notification_url:
            "https://cloud-gaming-server.onrender.com" + "/payments/notif",
        },
      });
      console.log(p.sandbox_init_point);
      return res.status(201).json({ url: p.sandbox_init_point });
    } catch (error) {
      // TODO
      return res.status(500);
    }
  };

  receiveOrder = async (req, res) => {
    const query = req.query;
    const id = query["data.id"];
    console.log(id, topic);
    const idempotencyKey = uuidv4().replace(/-/g, "").slice(0, 10);
    const client = new MercadoPagoConfig({
      accessToken: SELLERTOKEN,
      options: { timeout: 5000, idempotencyKey: idempotencyKey },
    });

    const payment = new Payment(client);

    payment.get({
      id: id,
    }).then(r => {
        console.log(r.payer.email);

    })
  };

  logRecibido = async (req,res) => {
    console.log(req.path);
    console.log(req.body);
    console.log(req.query);
  }
}
