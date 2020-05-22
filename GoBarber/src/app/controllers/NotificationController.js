import User from "../models/User";
import Notification from "../schemas/Notification";

class NotificationController {
  async index(req, res) {
    /**
     * só prestadores de serviço pode acessar
     */
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: "Only provider con load notifications" });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: "desc" })
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
