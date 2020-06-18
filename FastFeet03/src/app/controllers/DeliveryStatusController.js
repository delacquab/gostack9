import { Op } from "sequelize";
import * as Yup from "yup";
import {
  isAfter,
  isBefore,
  parseISO,
  setSeconds,
  setMinutes,
  setHours,
  startOfDay,
  endOfDay
} from "date-fns";

import Delivery from "../models/Delivery";
import Deliveryman from "../models/Deliveryman";
import Recipient from "../models/Recipient";
import File from "../models/File";

class DeliveryStatusController {
  async index(req, res) {
    const { id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: "Deliveryman does not exists" });
    }

    const { page = 1 } = req.query;
    const { completed = false } = req.query;

    console.log(completed);
    console.log(req.query);

    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        signature_id: completed ? { [Op.ne]: null } : null
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

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { deliveryman_id, delivery_id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: "Deliveryman does not exists" });
    }

    const deliveryExists = await Delivery.findByPk(delivery_id);

    if (!deliveryExists) {
      return res.status(400).json({ error: "Delivery does not exists" });
    }

    if (deliveryExists.deliveryman_id != deliveryman_id) {
      return res.status(400).json({
        error: "Delivery does not belongs to this deliveryman"
      });
    }
    const startDate = parseISO(req.body.start_date);
    if (startDate) {
      const startInterval = setSeconds(
        setMinutes(setHours(startDate, 8), 0),
        0
      );
      const endInterval = setSeconds(setMinutes(setHours(startDate, 18), 0), 0);

      if (
        isAfter(startDate, endInterval) ||
        isBefore(startDate, startInterval)
      ) {
        return res
          .status(400)
          .json({ error: "Orders pickup only between 08:00 and 18:00" });
      }

      const ordersPickupInDay = await Delivery.findAll({
        where: {
          deliveryman_id: { [Op.eq]: deliveryman_id },
          start_date: {
            [Op.between]: [startOfDay(startDate), endOfDay(startDate)]
          }
        }
      });
      console.log(ordersPickupInDay);
    }

    return res.json();
  }
}
export default new DeliveryStatusController();
