var Sifter = require('sifter');

module.exports = function(robot) {
  return robot.respond(/resource (.*)/i, function(msg) {
    var query, result, terms;
    query = msg.match[1];
    terms = query.split(" ");
    //console.log(terms);
    result = [];
    //return msg.http("http://localhost:3000/data.json").get()(function(err, res, body) {
    return msg.http("http://localhost/so-resources/js/data.json").get()(function(err, res, body) {
      var index, key, ref, resource, results, value;
      if (JSON.parse(body) != null) {
        ref = JSON.parse(body).resources;
        results = [];
        var sifter = new Sifter(ref);

        console.log(query)
        var result = sifter.search(query, {
          fields: ["p", "e", "n", "h", "u", "t", "x"],
          limit: 5
        })

        var full_response = "";
        for (var item in result.items) {
          var response = ref[result.items[item].id];
          full_response += response.p + ' ' + response.e + ' ' + response.u + ' or ';
        }
        if (full_response ==  "") {
          full_response = query + " not found"
        }
        return msg.reply(full_response);

        /*
        for (index in ref) {
          //console.log(ref);
          resource = ref[index];
          result[index] = resource;
          result[index].count = 0;
          for (key in resource) {
            value = resource[key];
            if (value != null) {
              if (typeof value === 'string') {
                if (terms.some(function(word) {
                      return ~value.indexOf(word);
                    })) {
                  result[index].count = 1 + result[index].count;
                  //console.log('upping counter');
                }
              }
            }
          }
          result = (function(result) {
            var i, keys, len, name, results1;
            keys = Object.keys(result).sort(function(a, b) {
              return result[b].count - result[a].count;
            });
            results1 = [];
            for (i = 0, len = keys.length; i < len; i++) {
              name = keys[i];
              results1.push({
                name: name,
                count: result[name]
              });
            }
            return results1;
          })(result);
          //results.push(console.log(result));
        }
        return results;*/
      } else {
        return msg.reply('Cannot find resource!');
      }

    });
  });
};
