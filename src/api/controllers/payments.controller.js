import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import {User} from "../../models/User.js";
import { subscribers } from "../../index.js";


export class PaymentController {
  constructor() {}

  
  createOrder = async (req, res) => {
    const idempotencyKey = uuidv4().replace(/-/g, "").slice(0, 10);
    const client = new MercadoPagoConfig({
      accessToken: process.env.SELLERTOKEN,
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
    const idempotencyKey = uuidv4().replace(/-/g, "").slice(0, 10);
    const client = new MercadoPagoConfig({
      accessToken: process.env.SELLERTOKEN,
      options: { timeout: 5000, idempotencyKey: idempotencyKey },
    });

    const payment = new Payment(client);

    payment.get({
      id: id,
    })
    .then(async r => {
      const email = r.payer.email;
      const quantity = r.additional_info.items[0].quantity;
      
      console.log(r.payer.email);
      console.log(r.additional_info.items[0].quantity);

      const minutes = quantity * 60;
      
      const user =  await User.findOne({where: {mercadopago_mail: email}});
      if(!user){
        console.log("User not found with mercadopago email provided");
        return;
      }
      user.set({credits: minutes});
      await user.save();
      subscribers.sendPaymentNotification(user.username);

    })
    .catch(error => {
      console.error("Error occurred:", error);
      // Handle the error appropriately here
    });
  };

  logRecibido = async (req,res) => {
    console.log(req.path);
    console.log(req.body);
    console.log(req.query);
  }
}
