module.exports = function(robot) {
  return robot.respond(/print (.*)/i, function(msg) {
    
      // printer logic goes here
        return msg.reply("Okay boss Ill send that to the printer");
  });
};