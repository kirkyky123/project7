const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");

app.use(express.static("public"));
app.use(express.json());

const cors = require("cors");
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://chhetrik:PrBBYtadSqegqBwl@cluster0.mrtzbch.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));

const playerSchema = new mongoose.Schema({
  name: String,
  current_season_stats: {
    shot_to_goal_ratio: Number,
    goal_contribution_per_game: Number,
    assists_per_game: Number,
    free_kicks_per_game: Number,
  },
  all_time_stats: {
    shot_to_goal_ratio: Number,
    goal_contribution_per_game: Number,
    assists_per_game: Number,
    free_kicks_per_game: Number,
  },
  trophy_records: {
    champions_league: Number,
    league_title: Number,
    world_cup: Number,
  },
  match_history: [
    {
      team: String,
      opponent: String,
      score: String,
    },
  ],
  worth: [Number],
});

const Player = mongoose.model("Player", playerSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get("/api/players", async (req, res) => {
  getPlayers(res);
});

const getPlayers = async (res) => {
  const players = await Player.find();
  res.send(players);
};

app.get("/api/players/:id", (req, res) => {
  getPlayer(res, req.params.id);
});

const getPlayer = async (res, id) => {
  const player = await Player.findOne({ _id: id });
  res.send(player);
};

app.post("/api/players", async (req, res) => {
  const result = validatePlayer(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }



  const player = new Player({
    name: req.body.name,
    current_season_stats: req.body.current_season_stats,
    all_time_stats: req.body.all_time_stats,
    trophy_records: req.body.trophy_records,
    match_history: req.body.match_history,
    worth: req.body.worth,
  });

  try {
    await player.save();
    res.send(player);
  } catch (error) {
    console.error("Error saving player:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/players/:id", async (req, res) => {
  const result = validatePlayer(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) {
      res.status(404).send("Player not found");
      return;
    }
    res.send(player);
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/players/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      res.status(404).send("Player not found");
      return;
    }
    res.send(player);
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).send("Internal Server Error");
  }
});

const validatePlayer = (player) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().required(),
    current_season_stats: Joi.object({
      shot_to_goal_ratio: Joi.number().required(),
      goal_contribution_per_game: Joi.number().required(),
      assists_per_game: Joi.number().required(),
      free_kicks_per_game: Joi.number().required(),
    }).required(),
    all_time_stats: Joi.object({
      shot_to_goal_ratio: Joi.number().required(),
      goal_contribution_per_game: Joi.number().required(),
      assists_per_game: Joi.number().required(),
      free_kicks_per_game: Joi.number().required(),
    }).required(),
    trophy_records: Joi.object({
      champions_league: Joi.number().required(),
      league_title: Joi.number().required(),
      world_cup: Joi.number().required(),
    }).required(),
    match_history: Joi.array().items(
      Joi.object({
        team: Joi.string().required(),
        opponent: Joi.string().required(),
        score: Joi.string().required(),
      })
    ),
    worth: Joi.array().items(Joi.number()).required(),
  });

  return schema.validate(player);
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
