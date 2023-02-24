var DataTypes = require("sequelize").DataTypes;
var _demoaccount = require("./demoaccount");
var _dept = require("./dept");
var _discord_challenges = require("./discord_challenges");
var _discord_rps = require("./discord_rps");
var _discord_rps_choices = require("./discord_rps_choices");
var _discord_users = require("./discord_users");
var _tmp_counter = require("./tmp_counter");

function initModels(sequelize) {
  var demoaccount = _demoaccount(sequelize, DataTypes);
  var dept = _dept(sequelize, DataTypes);
  var discord_challenges = _discord_challenges(sequelize, DataTypes);
  var discord_rps = _discord_rps(sequelize, DataTypes);
  var discord_rps_choices = _discord_rps_choices(sequelize, DataTypes);
  var discord_users = _discord_users(sequelize, DataTypes);
  var tmp_counter = _tmp_counter(sequelize, DataTypes);

  discord_rps.belongsTo(discord_rps_choices, { as: "challenge_choice_discord_rps_choice", foreignKey: "challenge_choice"});
  discord_rps_choices.hasMany(discord_rps, { as: "discord_rps", foreignKey: "challenge_choice"});
  discord_rps.belongsTo(discord_rps_choices, { as: "initiator_choice_discord_rps_choice", foreignKey: "initiator_choice"});
  discord_rps_choices.hasMany(discord_rps, { as: "initiator_choice_discord_rps", foreignKey: "initiator_choice"});
  discord_challenges.belongsTo(discord_users, { as: "user", foreignKey: "user_id"});
  discord_users.hasMany(discord_challenges, { as: "discord_challenges", foreignKey: "user_id"});
  discord_rps.belongsTo(discord_users, { as: "challenge_target", foreignKey: "challenge_target_id"});
  discord_users.hasMany(discord_rps, { as: "discord_rps", foreignKey: "challenge_target_id"});
  discord_rps.belongsTo(discord_users, { as: "initiator", foreignKey: "initiator_id"});
  discord_users.hasMany(discord_rps, { as: "initiator_discord_rps", foreignKey: "initiator_id"});

  return {
    demoaccount,
    dept,
    discord_challenges,
    discord_rps,
    discord_rps_choices,
    discord_users,
    tmp_counter,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
