const db = require("../../data/dbConfig");

function findById(id) {
  return db("users").where({ id }).first();
}

async function addUser(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

function findBy(filter) {
  return db("users").where(filter);
}

module.exports = {
  findById,
  addUser,
  findBy,
};
