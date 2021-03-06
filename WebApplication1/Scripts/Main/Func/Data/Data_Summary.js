﻿define(function () {
  var _Status = {};

  var _GetData = function () {
    var dtd = $.Deferred();
    var _href = window.location.href;
    //var _url = _href.substr(_href.length - 1, 1) === '/' ? _href : _href + '/';
    var _url = window.location.origin + '/ChyHackerAPI/api/SummaryVill';
    //_url += 'SummaryVill.json';
    var _data = {};
    var _option = { async: true, dataType: "JSON", type: "GET" };
    var _callback = function (evt) {
      var xmlDoc = evt.Result;
      return dtd.resolve(xmlDoc);
    }
    Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
    return dtd.promise();
  }
  //取得綜合分析
  var _GetSummaryData = function (_vill_id) {
    var dtd = $.Deferred();
    var _url = window.location.origin + '/ChyHackerAPI/api/SummaryVill';
    var _data = {
      vill_id: _vill_id
    };
    var _option = { async: true, dataType: "JSON", type: "GET" };
    var _callback = function (evt) {
      var xmlDoc = evt.Result;
      return dtd.resolve(xmlDoc);
    }
    Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
    return dtd.promise();
  }

  var _GetPassengerData = function (_town_id, _year, _month) {
    var dtd = $.Deferred();
    var _url = window.location.origin + '/ChyHackerAPI/api/SummaryVill';
    var _data = {
      type: 'PassengersNa',
      town_id: _town_id,
      year: _year,
      month: _month
    };
    var _option = { async: true, dataType: "JSON", type: "GET" };
    var _callback = function (evt) {
      var xmlDoc = evt.Result;
      return dtd.resolve({
        month: _month,
        data: xmlDoc
      });
    }
    Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
    return dtd.promise();
  }

  var module = {
    GetData: function (_fileName) {
      var dtd = $.Deferred();
      $.when(_GetData()).then(function (data) { return dtd.resolve(data); })
      return dtd.promise();
    },
    GetSummaryData: function (_town_id) {
      var dtd = $.Deferred();
      $.when(_GetSummaryData(_town_id)).then(function (data) { return dtd.resolve(data); })
      return dtd.promise();
    },
    GetPassengerData: function (town_id, _year, _smonth, _emonth) {
      var dtd = $.Deferred();
      if (_smonth > _emonth) { return dtd.reject(); }
      var respone = []
      for (var i = 0, count = 0; i <= _emonth - _smonth; i++) {
        $.when(_GetPassengerData(town_id, _year, _smonth + i)).then(function (data) {
          respone.push(data);
          //資料都回來才resolve
          if (respone.length === _emonth - _smonth + 1) {
            // ****** 注意!!目前因為沒資料先做假資料，之後移除這段即可 ************
            respone = []
            for (var i = 0; i < 7; i++) {
              respone.push({
                month: i + 1,
                data: data.data
              });
            }
            // ************************************************************

            return dtd.resolve(respone);
          }
        })
      }
      return dtd.promise();
    }
  };

  return module;
})