import * as Yup from "yup";
import Delivery from "../models/Delivery";
import User from "../models/User";
import File from "../models/File";
import Recipient from "../models/Recipient";
import Deliveryman from "../models/Deliveryman";

import NewDeliveryMail from "../jobs/NewDeliveryMail";
import Queue from "../../lib/Queue";

class DeliveryController {
  async index(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: "User is not a admin" });
    }

    const { page = 1 } = req.query;

    const delivery = await Delivery.findAll({
      order: ["id"],
      attributes: ["id", "product", "canceled_at", "start_date", "end_date"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: "signature",
          attributes: ["id", "path", "url"]
        },
        {
          model: Recipient,
          as: "recipient",
          attributes: [
            "id",
            "name",
            "email",
            "street",
            "number",
            "complement",
            "neighborhood",
            "city",
            "state",
            "zip_code"
          ]
        },
        {
          model: Deliveryman,
          as: "deliveryman",
          attributes: ["id", "name", "email"],
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["id", "path", "url"]
            }
          ]
        }
      ]
    });

    return res.json(delivery);
  }

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

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: "User is not a admin" });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery does not exists" });
    }

    const { deliveryman_id } = req.body;

    if (deliveryman_id && deliveryman_id !== delivery.deliveryman_id) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

      if (!deliverymanExists) {
        return res.status(400).json({ error: "Deliveryman does not exists" });
      }
    }

    const { recipient_id } = req.body;

    if (recipient_id && recipient_id !== delivery.recipient_id) {
      const recipientExists = await Recipient.findByPk(recipient_id);

      if (!recipientExists) {
        return res.status(400).json({ error: "Recipient does not exists" });
      }
    }

    const { id, product } = await delivery.update(req.body);

    return res.json({ id, product, recipient_id, deliveryman_id });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: "User is not a admin" });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: "Delivery does not exists" });
    }

    await Delivery.destroy({ where: { id: req.params.id } });

    return res.status(200).json();
  }
}

export default new DeliveryController();
