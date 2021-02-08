var menuSql = {
    add: "INSERT INTO usermenu(user_id, menu) VALUES (?, ?);",
    query: "SELECT * FROM usermenu WHERE user_id = ?;",
    update: "UPDATE usermenu SET menu = ? WHERE user_id = ?;"
};
module.exports = menuSql;
