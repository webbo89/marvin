module.exports = function(robot) {
  return robot.respond(/quote/i, function(msg) {
    
    var quotes = ["Shee, you guys are so unhip it’s a wonder your bums don’t fall off. ",
"Funny, how just when you think life can’t possibly get any worse it suddenly does. ",
"A common mistake that people make when trying to design something completely foolproof is to underestimate the ingenuity of complete fools.",
"He was staring at the instruments with the air of one who is trying to convert Fahrenheit to centigrade in his head while his house is burning down.",
"It is a mistake to think you can solve any major problems just with potatoes.",
"Nothing travels faster than the speed of light with the possible exception of bad news, which obeys its own special laws.",
"Don’t Panic.",
"In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.",
"Time is an illusion. Lunchtime doubly so.",
"This must be Thursday,' said Arthur to himself, sinking low over his beer. 'I never could get the hang of Thursdays.",
"Ford... you're turning into a penguin. Stop it.",
"So long, and thanks for all the fish.",
"We demand rigidly defined areas of doubt and uncertainty!",
"Anyone who is capable of getting themselves made President should on no account be allowed to do the job."];
var choice = Math.floor((Math.random() * quotes.length));
        return msg.reply(quotes[choice]);
  });
};
