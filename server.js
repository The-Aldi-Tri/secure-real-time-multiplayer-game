require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const socket = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// helmetJs setup
app.use(helmet.noSniff()); // The client should not be able to guess/sniff the MIME type
app.use(helmet.xssFilter()); // Prevent XSS attacks
app.use(helmet.noCache()); // Do not cache anything from the website in the client
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.3" })); // The headers say that the site is powered by PHP 7.4.3

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: "*" }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

// Socket.io setup:
const Collectible = require("./public/Collectible");
const { generateRandomPos } = require("./public/canvas-data");
const io = socket(server);

let currentPlayers = [];
const destroyedCoins = [];

function generateCoin() {
  const randomValue = Math.random();
  let coinValue;

  if (randomValue < 0.6) {
    coinValue = 1;
  } else if (randomValue < 0.85) {
    coinValue = 2;
  } else {
    coinValue = 3;
  }

  const [x, y] = generateRandomPos();

  return new Collectible({
    x: x,
    y: y,
    value: coinValue,
    id: Date.now(),
  });
}

let coin = generateCoin();

io.sockets.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.emit("init", { id: socket.id, players: currentPlayers, coin });

  socket.on("new-player", (obj) => {
    obj.id = socket.id;
    currentPlayers.push(obj);
    socket.broadcast.emit("new-player", obj);
  });

  socket.on("move-player", (dir, obj) => {
    const movingPlayer = currentPlayers.find(
      (player) => player.id === socket.id
    );
    if (movingPlayer) {
      movingPlayer.x = obj.x;
      movingPlayer.y = obj.y;

      socket.broadcast.emit("move-player", {
        id: socket.id,
        dir,
        posObj: { x: movingPlayer.x, y: movingPlayer.y },
      });
    }
  });

  socket.on("stop-player", (dir, obj) => {
    const stoppingPlayer = currentPlayers.find(
      (player) => player.id === socket.id
    );
    if (stoppingPlayer) {
      stoppingPlayer.x = obj.x;
      stoppingPlayer.y = obj.y;

      socket.broadcast.emit("stop-player", {
        id: socket.id,
        dir,
        posObj: { x: stoppingPlayer.x, y: stoppingPlayer.y },
      });
    }
  });

  socket.on("destroy-item", ({ playerId, coinValue, coinId }) => {
    if (!destroyedCoins.includes(coinId)) {
      const scoringPlayer = currentPlayers.find((obj) => obj.id === playerId);
      const sock = io.sockets.connected[scoringPlayer.id];

      scoringPlayer.score += coinValue;
      destroyedCoins.push(coinId);

      // Broadcast to all players when someone scores
      io.emit("update-player", scoringPlayer);

      // Communicate win state and broadcast losses
      if (scoringPlayer.score >= 100) {
        sock.emit("end-game", "win");
        sock.broadcast.emit("end-game", "lose");
      }

      // Generate new coin and send it to all players
      coin = generateCoin();
      io.emit("new-coin", coin);
    }
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("remove-player", socket.id);
    currentPlayers = currentPlayers.filter((player) => player.id !== socket.id);
  });
});

module.exports = app; // For testing
