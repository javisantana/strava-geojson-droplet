
(function() {

  // ajax get
  function get(url, c) {
    var x = new XMLHttpRequest();
    x.onreadystatechange = function() {
      if (x.readyState === 4 && x.status === 200) {
        c(x.responseText);
      }
    }
    x.open("GET", url, true);
    x.send();
  }

  // strava streams to geojson
  function toGeoJSON(stream) {
    var attrs = Object.keys(stream);

    var geojson = {
      "type": "FeatureCollection",
      "features": []
    }

    function props(i) {
      var p = {}
      attrs.forEach(function (v) {
        p[v] = stream[v][i];
      });
      return p;
    }

    for (var i = 0; i < stream.latlng.length; ++i) {
      var pos = stream.latlng[i];
      geojson.features.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [pos[1], pos[0]]
        },
        "properties": props(i)
      })
    }

    return geojson;
  }

  function download(t, fname) {
    var data = new Blob([t], { type: 'application/json' });
    var a = document.createElement('a');
    a.setAttribute('download', fname);
    a.href = window.URL.createObjectURL(data);
    document.body.appendChild(a);
    a.click();
  }

  var API_URL_TEMPLATE = 'http://www.strava.com/activities/{activity_id}/streams?stream_types%5B%5D=resting&stream_types%5B%5D=altitude&stream_types%5B%5D=heartrate&stream_types%5B%5D=cadence&stream_types%5B%5D=temp&stream_types%5B%5D=distance&stream_types%5B%5D=grade_smooth&stream_types%5B%5D=time&stream_types%5B%5D=grade_adjusted_distance&stream_types%5B%5D=latlng';
  // activity id from url
  var activity_id = /[0-9]+$/.exec(location.href);
  if (activity_id !== null) {
    // fetch 
    get(API_URL_TEMPLATE.replace('{activity_id}', activity_id), function(streamsData) {
      var streams = JSON.parse(streamsData);
      // generate 
      var geoJSON = toGeoJSON(streams);
      // download
      download(JSON.stringify(geoJSON), "strava_" + activity_id + ".geojson")
    });
  } else {
    alert('not a strava activity page');
  }



})();
