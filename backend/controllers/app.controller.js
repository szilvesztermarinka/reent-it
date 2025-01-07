import { prisma } from "../config/prismaclient.js";

const OPERATORS = {
  lte: "lte",
  gte: "gte",
  contains: "contains",
  startsWith: "startsWith",
  endsWith: "endsWith",
};

export const getAllAd = async (req, res) => {
  try {
    const query = req.query;
    const filters = {};

    for (const [key, value] of Object.entries(query)) {
      const [field, operator] = key.split("_");
      if (operator && OPERATORS[operator]) {
        filters[field] = {
            ...(filters[field] || {}),
            [OPERATORS[operator]]: isNaN(value) ? value : parseFloat(value),
        };
    } else {
        filters[key] = isNaN(value) ? value : parseFloat(value);
      }
    }

    console.log(filters)

    const ads = await prisma.post.findMany({
      where: filters,
    });

    if (!ads || ads.length === 0) {
        return res.status(404).json({ success: false, message: "No ads found" });
      }


    res.status(200).json({
        success: true,
        ads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
