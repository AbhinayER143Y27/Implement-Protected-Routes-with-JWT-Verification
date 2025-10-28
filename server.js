import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "my_jwt_secret_key";

// Fake login endpoint → returns JWT
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "user@test.com" && password === "123456") {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

// Protected route
app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!`, user: req.user });
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
