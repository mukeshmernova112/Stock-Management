import Stock from "../models/Stock.js";

// Get stocks only for logged-in branch
export const getStocks = async (req, res) => {
  try {
    const branch = req.user.branch;
    const stocks = await Stock.find({ location: branch });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add stock only for admin
export const addStock = async (req, res) => {
  try {
    const { itemName, quantity } = req.body;
    const branch = req.user.branch;

    if (!itemName || !quantity) return res.status(400).json({ msg: "All fields required" });

    const stock = await Stock.create({
      itemName,
      quantity: Number(quantity),
      location: branch, // always set from JWT
    });

    res.status(201).json({ msg: "Stock added", stock });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const userBranch = req.user.branch;
    const userRole = req.user.role;

    const stock = await Stock.findById(id);
    if (!stock) return res.status(404).json({ msg: "Stock not found" });

    // Debug log
    console.log("Incoming update:", req.body);
    console.log("User role:", userRole);

    if (stock.location !== userBranch && userRole !== "admin") {
      return res.status(403).json({ msg: "Not authorized to update this stock" });
    }

    const { itemName, quantity, location } = req.body;

    if (itemName) stock.itemName = itemName;
    if (quantity) stock.quantity = Number(quantity);

    // 📍 Allow location update ONLY IF field exists and user is admin
    if (location) {
      if (userRole === "admin") {
        stock.location = location;
      } else {
        return res.status(403).json({ msg: "Only admin can update location" });
      }
    }

    await stock.save();
    res.json({ msg: "Stock updated", stock });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Delete stock only if belongs to branch & admin
export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = req.user.branch;

    const stock = await Stock.findOneAndDelete({ _id: id, location: branch });
    if (!stock) return res.status(404).json({ msg: "Stock not found in your branch" });

    res.json({ msg: "Stock deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
