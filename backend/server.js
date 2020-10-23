"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { top50 } = require("./data/top50");

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇
  .get("/top50", (req, res) => {
    res.status(200).json({ status: 200, top50 });
  })

  .get("/top50/song/:rank", (req, res) => {
    console.log(req.params);
    const songRank = req.params.rank;
    const song = top50.find((element) => element.rank == songRank);
    console.log(song);
    if (song) {
      res.status(200).json({ status: 200, song });
    } else {
      res.status(404).json({ status: 404, message: "song not found" });
    }
  })

  .get("/top50/artist/:artist", (req, res) => {
    console.log(req.params);
    const artistName = req.params.artist;
    const artist = top50.filter((element) =>
      element.artist.includes(artistName)
    );
    console.log(artist);
    if (artist) {
      res.status(200).json({ status: 200, artist });
    } else {
      res.status(404).json({ status: 404, message: "Artist not found" });
    }
  })

  .get("/top50/top-artist", (req, res) => {
    console.log(req.params);
    const popObj = {};
    let mostPop = undefined;
    top50.forEach((song) => {
      const name = song.artist;
      if (popObj[name]) {
        popObj[name].push(song);
      } else {
        popObj[name] = [song];
      }

      if (mostPop) {
        if (mostPop.songs.length < popObj[name].length) {
          mostPop = { name: name, songs: popObj[name] };
        }
      } else {
        mostPop = { name: name, songs: [song] };
      }
    });
    console.log(popObj);
    console.log(mostPop);
    res.status(200).json({ status: 200, mostPop });
  })

  .get("/top50/artist", (req, res) => {
    console.log(req.params);
    const artistList = new Set();
    top50.forEach((song) => {
      console.log(song.artist);
      artistList.add(song.artist);
    });
    console.log(artistList);
    res.status(200).json({ status: 200, message: [...artistList] });
  })
  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
