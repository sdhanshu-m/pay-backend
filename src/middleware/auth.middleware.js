import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  console.log("---- REQUEST HIT ----");
  console.log("AUTH HEADER:", req.headers.authorization);

  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};