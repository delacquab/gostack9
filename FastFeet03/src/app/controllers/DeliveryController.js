import * as Yup from "yup";
import Delivery from "../models/Delivery";
import User from "../models/User";
import File from "../models/File";
import Recipient from "../models/Recipient";
import Deliveryman from "../models/Deliveryman";

import NewDeliveryMail from "../jobs/NewDeliveryMail";
import Queue from "../../lib/Queue";

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: "User is not a admin" });
    }

    const recipientExists = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: "Recipient does not exists" });
    }

    const deliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );

    if (!deliverymanExists) {
      return res.status(400).json({ error: "Deliveryman does not exists" });
    }

    const { id, recipient_id, deliveryman_id, product } = await Delivery.create(
      req.body
    );

    await Queue.add(NewDeliveryMail.key, {
      deliverymanExists,
      recipientExists,
      product
    });

    return res.json({ id, recipient_id, deliveryman_id, product });
  }
}

export default new DeliveryController();
