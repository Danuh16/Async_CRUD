const allowedOrigin = require ('./allowedOrigin')


const corsOptions = {
  origin: (origin, callback) => {
    // console.log("CORS origin:", origin);
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // console.warn("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};


module.exports = {corsOptions}