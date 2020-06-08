import Mail from "../../lib/Mail";

class NewDeliveryMail {
  get key() {
    return "NewDelivery";
  }

  async handle({ data }) {
    const { deliverymanExists, recipientExists, product } = data;

    await Mail.sendMail({
      to: `${deliverymanExists.email} <${deliverymanExists.email}>`,
      subject: "Nova encomenda",
      template: "newDelivery",
      context: {
        deliveryman: deliverymanExists.name,
        recipient: recipientExists.name,
        product: product
      }
    });
  }
}

export default new NewDeliveryMail();
