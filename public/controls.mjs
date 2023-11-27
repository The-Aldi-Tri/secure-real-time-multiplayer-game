const controls = (player, socket) => {
  const getKey = (e) => {
    if (e.keyCode === 87 /* 'W' */ || e.keyCode === 38 /* Arrow UP */)
      return "up";
    if (e.keyCode === 65 /* 'A' */ || e.keyCode === 37 /* Arrow LEFT */)
      return "left";
    if (e.keyCode === 83 /* 'S' */ || e.keyCode === 40 /* Arrow DOWN */)
      return "down";
    if (e.keyCode === 68 /* 'D' */ || e.keyCode === 39 /* Arrow RIGHT */)
      return "right";
  };

  document.onkeydown = (e) => {
    let dir = getKey(e);

    if (dir) {
      player.moveDir(dir);

      // Pass current player position back to the server
      socket.emit("move-player", dir, { x: player.x, y: player.y });
    }
  };

  document.onkeyup = (e) => {
    let dir = getKey(e);

    if (dir) {
      player.stopDir(dir);

      // Pass current player position back to the server
      socket.emit("stop-player", dir, { x: player.x, y: player.y });
    }
  };
};

export default controls;
