import * as Yup from "yup";
import Deliveryman from "../models/Deliveryman";
import User from "../models/User";
import File from "../models/File";

class DeliverymanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryman = await Deliveryman.findAll({
      order: ["name"],
      attributes: ["id", "name", "email"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["id", "path", "url"]
        }
      ]
    });

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      avatar_id: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: "User is not a admin" });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email }
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: "Deliveryman already exists" });
    }

    const { id, name, email, avatar_id } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      avatar_id: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: "User is not a admin" });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ erro: "Deliveryman not exists" });
    }

    const { email } = req.body;

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email } });

      if (deliverymanExists) {
        return res.status(400).json({ error: "Deliveryman already exists" });
      }
    }

    const { id, name, avatar_id } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id
    });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user.admin) {
      return res.status(401).json({ error: "User is not a admin" });
    }

    const { id } = req.params;
    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: "Deliveryman does not exists" });
    }

    await Deliveryman.destroy({ where: { id } });

    return res.status(200).json();
  }
}

export default new DeliverymanController();
