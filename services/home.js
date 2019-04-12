
const index = (req, res, next) => res.status(200).json({ message: "Welcome to Home page." });

module.exports = { index };