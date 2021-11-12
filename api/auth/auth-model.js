const db = require("../../data/dbConfig");

function findById(id) {
  return db("users").where({ id }).first();
}

async function addUser(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

module.exports = {
  findById,
  addUser,
};
