const { Sequelize, QueryTypes } = require("sequelize");
var initModels = require("./models/init-models");
const moment = require("moment-timezone");

const dbcreds = require("./sqauto.json");

dbcreds.user = process.env.DBUSER;
dbcreds.port = process.env.PORT;
dbcreds.database = process.env.DATABASE;
dbcreds.host = process.env.HOST;
dbcreds.password = process.env.PASSWORD;

const sequelize = new Sequelize(
  dbcreds.database,
  dbcreds.user,
  dbcreds.password,
  dbcreds
);

var models = initModels(sequelize);
sequelize.authenticate();

console.log("Database loaded...");

function getCurrentDay(_day, realOffset) {
  switch (_day) {
    case "sunday":
      return 6 + realOffset * 7;

    case "monday":
      return 5 + realOffset * 7;

    case "tuesday":
      return 4 + realOffset * 7;

    case "wednesday":
      return 3 + realOffset * 7;

    case "thursday":
      return 2 + realOffset * 7;

    case "friday":
      return 1 + realOffset * 7;

    case "saturday":
      return 7 + realOffset * 7;

    default:
      throw new Error(
        "Crash without grace: invalid day selected forGetCurrentDay."
      );
  }
}

async function setNewChallenge(
  challenge_name,
  description,
  user,
  saturdayChoice
) {
  const user_id = await getRegisteredUser(user);
  if (!user_id) return "You must register to create a challenge.";
  const currentChallenge = getCurrentChallenge();
  if (currentChallenge.length > 0)
    return `A challenge (${currentChallenge[0].challenge_name}) is already running. Wait until that one is over to start a new one.`;
  try {
    const currentDay = await sequelize
      .query("SELECT to_char(now(), 'day') as result", {
        type: QueryTypes.SELECT,
      })
      .then((x) => x[0].result.trim());

    let offset;

    //This crudely reduces the offset. If it's in a week, it takes the raw difference between today's date and the next Saturday. Otherwise, it adds 7.
    offset = getCurrentDay(currentDay, saturdayChoice - 1);

    const end_date = await sequelize
      .query(
        `SELECT to_char(now () + interval '${offset} days', 'YYYY-MM-DD') AS result`,
        { type: QueryTypes.SELECT }
      )
      .then((x) =>
        moment.tz(`${x[0].result} 23:59:59`, "America/New_York").valueOf()
      );

    const newChallenge = await models.discord_challenges.create({
      challenge_name,
      description,
      user_id,
      end_date,
    });

    newChallenge.save();

    return `A new art challenge has been initiated! \n\nChallenge **${newChallenge.challenge_name.toUpperCase()}**${
      newChallenge.description
        ? " with description **" + newChallenge.description + "**"
        : ""
    } will end at ${moment
      .tz(end_date, "America/New_York")
      .format("MM/DD/YYYY hh:mma")}.\n\nStart arting!`;
  } catch (e) {
    console.error(e);
    return "There was a problem.";
  }
}

async function updateChallengeNotification(last_challenge_notice, id) {
  await models.discord_challenges.update(
    {
      last_challenge_notice,
    },
    {
      where: {
        id,
      },
    }
  );
}

async function getCurrentChallenge() {
  try {
    const currentChallenge = await sequelize.query(
      "SELECT * FROM discord_challenges WHERE last_challenge_notice IS NULL OR end_date > last_challenge_notice ORDER BY id DESC",
      { type: QueryTypes.SELECT }
    );
    return currentChallenge;
  } catch (e) {
    console.error(e);
  }
}

async function getRegisteredUser(user) {
  const internalUser = await models.discord_users
    .findAll({
      where: {
        user_id: user.id,
      },
    })
    .then((x) => x[0]?.id);
  if (internalUser === null || internalUser === undefined) {
    console.log("User not in database.");
    return false;
  }
  return internalUser;
}

//Log a game of Rock, Paper Scissors. Opponent hardcoded for now for testing.
async function logRPSGame(user, userGuess, opponent, opponentGuess) {
  let internalUser = await getRegisteredUser(user);
  if (!internalUser) return "You need to register to play this game.";

  const newGame = await models.discord_rps.create({
    initiator_id: internalUser,
    challenge_target_id: 1,
    initiator_choice: await models.discord_rps_choices
      .findAll({
        where: { name: userGuess },
      })
      .then((x) => x[0].id),
    challenge_choice: await models.discord_rps_choices
      .findAll({
        where: { name: opponentGuess },
      })
      .then((x) => x[0].id),
    challenge_date: sequelize.fn("NOW"),
  });

  newGame.save();
}

//Add user to the database.
async function addUser(user) {
  try {
    const users = await models.discord_users.findAll({
      where: {
        user_id: user.id,
      },
    });
    if (users.map((x) => x.dataValues).length > 0)
      return "You're already registered!";

    const newuser = await models.discord_users.create({
      username: user.username,
      user_id: user.id,
      date_created: sequelize.fn("NOW"),
    });
    newuser.save();
    return "You've been registered! You can now use expanded Jackbot functionality.";
  } catch (e) {
    console.log(e);
    return "There was a problem registering you.";
  }
}

module.exports = {
  updateChallengeNotification,
  setNewChallenge,
  getCurrentChallenge,
  addUser,
  logRPSGame,
};
