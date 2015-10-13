var Sifter = require('sifter');
var _ = require('lodash');

function sift_keyword(keyword, resources) {
  var sifter = new Sifter(resources);
  var result = sifter.search(keyword, {
    fields: ["p", "e", "n", "u", "t", "x"],
    limit: 5
  });
  return result;
}

function analyse_each_keyword(keywords, resources) {
  var results_sum = []
  for (var i = 0; i < keywords.length; i++) {
    var search_results = sift_keyword(keywords[i], resources)
    results_sum = _.union(results_sum, search_results.items)
  }
  var ans = reduce_list_and_sum(results_sum)
  return ans
};

var list = [{'id': 1, 'score': 1}, {'id': 1, 'score': 1}];

function reduce_list_and_sum(list) {
  var newList = list.reduce(function(memo, item) {
    var index = _.findIndex(memo, function(_item) {
      return _item.id == item.id;
    });

    if (index > -1) {

      var newScore = item.score + memo[index].score;
      memo[index] = {'id': item.id, 'score': newScore};
    } else {
      memo.push(item);
    }

    return memo;
  }, []);

  return newList;
}


module.exports = function(robot) {
  return robot.respond(/resource (.*)/i, function(msg) {
    var query, result, terms;
    query = msg.match[1];
    terms = query.split(" ");


    //return msg.http("http://localhost:3001/data.json").get()(function(err, res, body) {
    return msg.http("http://localhost/so-resources/js/data.json").get()(function(err, res, body) {
      var index, key, ref, resource, results, value;
      if (JSON.parse(body) == null) {
        return msg.reply('Cannot find resource!');
      }

      ref = JSON.parse(body).resources;
      var result = analyse_each_keyword(terms, ref);

      var full_response = "";

      result = _.sortBy(result, 'score')

      var result_count =  result.length
      for (var i = (result_count-1); i > Math.max(-1, result.length-6); i--) {
          var response = ref[result[i].id];
        full_response += response.p + ' ' + response.e + ' ' + response.u + result[i].score + "\n";
      }

      if (full_response ==  "") {
        full_response = query + " not found"
      }

      return msg.reply(full_response);

    });
  });
};
