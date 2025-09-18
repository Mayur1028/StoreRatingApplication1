// controllers/storeOwnerController.js
const { User, Store, Rating } = require("../models");

const getOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const store = await Store.findOne({
      where: { owner_id: userId },
      include: [
        {
          model: Rating,
          as: "ratings",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.json({
        store: null,
        averageRating: 0,
        ratingUsers: [],
      });
    }

    const ratings = store.ratings || [];
    const averageRating =
      ratings.length > 0
        ? (
            ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings.length
          ).toFixed(1)
        : 0;

    const ratingUsers = ratings.map((rating) => ({
      id: rating.user.id,
      name: rating.user.name,
      email: rating.user.email,
      rating: rating.rating,
      created_at: rating.created_at,
    }));

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      averageRating: parseFloat(averageRating),
      ratingUsers,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

module.exports = {
  getOwnerDashboard,
};
