import * as Yup from "yup";
import Recipient from "../models/Recipient";

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      neighborhood: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const recipientExists = await Recipient.findOne({
      where: { email: req.body.email }
    });

    if (recipientExists) {
      return res.status(400).json({ erro: "Recipient already exists" });
    }

    const {
      id,
      name,
      email,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zip_code
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      email,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zip_code
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      neighborhood: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zip_code: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ erro: "Recipient not exists" });
    }

    const { email } = req.body;
    // se o usuario for trocar o email
    if (email !== recipient.email) {
      const recipientExists = await Recipient.findOne({ where: { email } });

      if (recipientExists) {
        return res.status(400).json({ error: "Recipient already exists" });
      }
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zip_code
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      email,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zip_code
    });
  }
}

export default new RecipientController();
