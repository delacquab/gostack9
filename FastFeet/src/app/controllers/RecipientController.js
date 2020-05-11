import * as Yup from "yup";
import Recipient from "../models/Recipients";

class RecipientController {
  async store(req, res) {
    console.log(1);
    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name }
    });
    console.log(2);

    if (recipientExists) {
      return res.status(400).json({ error: "Recipient already exists." });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async stor2(req, res) {
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
    console.log(1);
    const recipientExists = await Recipient.findOne({
      where: { email: req.body.email }
    });
    console.log("2");

    console.log(recipientExists);

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
}

export default new RecipientController();
