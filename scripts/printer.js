/* Description
#   Send message to chatroom using HTTP POST
#
# URLS:
#   POST /hubot/notify/<room> (message=<message>)
*/


module.exports = function(robot) {

    global_print_spool = [];

    robot.router.post('/hubot/notify/:room', function(req, res) {
        var message, room;
        console.log(req.body)
        room = req.params.room;
        message = req.body.message;
        robot.messageRoom(room, message);
        var ready_for_print = []
        for (var i = 0, len = global_print_spool.length; i < len; i++) {
            ready_for_print.push(global_print_spool.pop());
        }
        return res.send(ready_for_print);
    })



    return robot.hear(/print (.*)/i, function(msg) {
        global_print_spool.push(msg.match[1]);
        var response = 'Sent to printer'
        if (Math.floor(Math.random()*100) == 50) {
            response = "http://www.quickmeme.com/img/ce/cedf6e36ec74aa18600ff0f0bcb06692f0e2b6fdbcb80372b9ec67222095343c.jpg"
        }
        if (Math.floor(Math.random()*100) == 50) {
            response = "http://cf.chucklesnetwork.com/items/7/6/9/3/4/original/yo-dawg-i-heard-you-like-printing-so-i-put-gel-pump-and-cell-pum.jpg"
        }
        return msg.reply(response);
    });
};
