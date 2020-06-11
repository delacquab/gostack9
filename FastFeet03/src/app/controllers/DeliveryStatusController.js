import { Op } from "sequelize";

import Delivery from "../models/Delivery";
import Deliveryman from "../models/Deliveryman";
import Recipient from "../models/Recipient";
import File from "../models/File";

class DeliveryStatusController {
  async show(req, res) {
    const { id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: "Deliveryman does not exists" });
    }

    const { page = 1 } = req.query;

    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: {
          [Op.ne]: null
        },
        end_date: {
          [Op.ne]: null
        }
      },
      order: [["end_date", "DESC"]],
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
        }
      ]
    });

    return res.json(delivery);
  }

  async index(req, res) {
    const { id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: "Deliveryman does not exists" });
    }

    const { page = 1 } = req.query;

    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null
      },
      order: ["start_date"],
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
        }
      ]
    });

    return res.json(delivery);
  }
}
export default new DeliveryStatusController();
