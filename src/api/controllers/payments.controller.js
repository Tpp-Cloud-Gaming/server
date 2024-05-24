import { MercadoPagoConfig, Preference } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import {User} from "../../models/User.js";
import { Payment } from "../../models/Payments.js";
import { subscriberController } from "../../ws/controllers/subscribers.controller.js";

const subscribers = subscriberController;

export class PaymentController {
  constructor() {}

  
  createOrder = async (req, res) => {
    const username = req.params;
    
    const user = await User.findOne({where: {username: username}});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    const payment = await Payment.create({username: user.username});
    const orderId = payment.order_id;
    console.log("Order id: ", orderId);

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
              id: orderId,

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
      
      payment.destroy();
      return res.status(500);
    }
  };

  receiveOrder = async (req, res) => {    
    const query = req.query;
    const id = query["data.id"];
    const type = query["type"];
    const topic = query["topic"];
    
    if ((type !== "payment" && !topic) || (topic !== "payment" && !type)) {
      return res.status(200).send("ok");
    }
    // console.log("Query", req.query);
    
    const idempotencyKey = uuidv4().replace(/-/g, "").slice(0, 10);
    const client = new MercadoPagoConfig({
      accessToken: process.env.SELLERTOKEN,
      options: { timeout: 5000, idempotencyKey: idempotencyKey },
    });

  
    payment.get({
      id: id,
    })
    .then(async r => {
  
      const  id = r.additional_info.items[0].id;
      console.log("Payment received with order id: ", id);
      const payment = await Payment.findOne({where: {order_id: id}});
      if(!payment){
        console.log("Payment not found with order id provided");
        return;
      }
      const quantity = r.additional_info.items[0].quantity;
      const minutes = quantity * 60;
      
      const user =  await User.findOne({where: {username: payment.username}});
      
      if(!user){
        console.log("User not found");
        return;
      }
      
      payment.set({status: "approved"});
      await payment.save();
      user.set({credits: minutes});
      await user.save();
  
      subscribers.sendPaymentNotification(user.username, quantity);
      return res.status(200).send("ok");
    })
    .catch(error => {
      console.error("Error occurred:", error);      
    });
  };

  logRecibido = async (req,res) => {
    console.log(req.path);
    console.log(req.body);
    console.log(req.query);
  }


}
