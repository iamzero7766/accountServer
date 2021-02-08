var videoSql = {
    query: "SELECT * FROM video_info WHERE video_type = ? ORDER BY dt_create LIMIT ?, ?;",
    add: "INSERT INTO video_info(user_id, video_url, video_image, video_info, video_title, dt_create, video_type) VALUES (?, ?, ?, ?, ?, ?, ?);",
    queryByID: "SELECT * FROM video_info WHERE video_id = ?;",
    delete: "DELETE FROM video_info WHERE video_id = ?;"
};
module.exports = videoSql;
