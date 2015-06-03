var moment = require('moment-range');
var request = require('request');
var hols_url = 'https://www.gov.uk/bank-holidays.json';
var http = require('http');
var _ = require('lodash');

module.exports = function(robot) {
  return robot.respond(/hols (.*) (.*) (.*)/i, function(res) {
    request({
        url: hols_url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          if (res.match[1] == "all") {
            res.send(all(body, moment(res.match[2]), moment(res.match[3])));
          } else if (res.match[1] == "next") {
            if (res.match[3] == "please") {
              res.send(nextHoliday(body, res.match[2]));
            } else {
              res.send("Say 'please'.");
            }
          }
        } else {
          console.log('does not work');
        }
    });
  });
};

function all(body, start, end) {
  var range = moment.range(moment(start, "YYYY-MM-DD"), moment(end, "YYYY-MM-DD"));
  var hols_and_wkends = ni_hols(body, range, s_hols(body, range, ew_hols(body, range, weekends(start, end))));
  return sql_script(sort_by_keys(hols_and_wkends));
}

function weekends(start, end) {
  var wkends = {};

  for (var m = moment(start); m.isBefore(end); m.add(1, 'days')) {
    if (m.format('dddd') == 'Saturday' || m.format('dddd') == 'Sunday') {
      wkends[str_with_time(m.format('YYYY-MM-DD'))] = [1,0,0,0,0];
    }
  }
  return wkends;
}

function ew_hols(body, range, hols_and_wkends) {
  _.each(body['england-and-wales'].events, function (event) {
    if (range.contains(moment(event.date))) {
      hols_and_wkends[str_with_time(event.date)] = [0,1,1,0,0];
    }
  });
  return hols_and_wkends;
}

function s_hols(body, range, hols_and_wkends) {
  var s_date = '';
  _.each(body['scotland'].events, function (event) {
    if (range.contains(moment(event.date))) {
      s_date = str_with_time(event.date);
      if (s_date in hols_and_wkends) {
        hols_and_wkends[s_date][3] = 1;
      } else {
        hols_and_wkends[s_date] = [0,0,0,1,0];
      }
    }
  });
  return hols_and_wkends;
}

function ni_hols(body, range, hols_and_wkends) {
  var ni_date = '';
  _.each(body['northern-ireland'].events, function (event) {
    if (range.contains(moment(event.date))) {
      ni_date = str_with_time(event.date);
      if (ni_date in hols_and_wkends) {
        hols_and_wkends[ni_date][4] = 1;
      } else {
        hols_and_wkends[ni_date] = [0,0,0,0,1];
      }
    }
  });
  return hols_and_wkends;
}

function str_with_time(hol_date) {
  return String(hol_date) + ' 00:00:00';
}

function sort_by_keys(hols_and_wkends) {
  keys = [];
  sorted_dates = {};
  for (var key in hols_and_wkends) {
    keys.push(key);
  }
  keys.sort();

  for (var i in keys) {
    sorted_dates[keys[i]] = hols_and_wkends[keys[i]];
  }

  return sorted_dates;
}

function sql_script(sorted_dates) {
  var script = "INSERT INTO `cts_holidays` VALUES ";
  var i = 0;
  for (key in sorted_dates) {
    i++;
    if (sorted_dates.hasOwnProperty(key)) {
      script = script.concat("('", key, "',", sorted_dates[key], ")", i == Object.keys(sorted_dates).length ? ";" : ",");
    } else {
      console.log('nope');
    }
  }
  return script;
}

function nextHoliday(body, region) {
  var today = moment(Date.now()).format('YYYY-MM-DD');
  var ary_date = [];
  var ary_title = [];
  _.each(body[region].events, function (event) {
    if (today < event.date) {
      ary_date.push(event.date);
      ary_title.push(event.title);
    }
  });
  return moment(ary_date[0]).format("Do MMMM YYYY") + " " + ary_title[0];
}
