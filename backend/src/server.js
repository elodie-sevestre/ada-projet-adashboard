import express from "express";
import cors from "cors";
import pool from "./db.js"; // connexion PostgreSQL
import { router } from "./router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello Ada!\n");
});

app.use("/", router);

// =================== CONNEXION BDD ===================

// Serveur express écoute port 3000, affiche "" et se connecte à la BDD

app.listen(3000, () => {
  console.log("🚀 Serveur lancé : http://localhost:3000");
});
