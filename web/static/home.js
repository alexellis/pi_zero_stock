function promiseMe(name) {
  var load = new RSVP.Promise(function(resolve, reject) {
    $.ajax("/stock/"+name).success(function(status, val, res) {
      if(res.status == 202) {
        resolve({name: name , status: null});
      }
      resolve({name: name , status: status});
    });
  });
  return load;
}

$("#statusList").text("Loading...");

var storeMappings = {
  "pimoroni": "https://shop.pimoroni.com/collections/raspberry-pi-zero",
  "pihut": "https://thepihut.com/products/raspberry-pi-zero?variant=14062715972",
  "adafruit": "https://www.adafruit.com/categories/813"
};

var nameMappings = {
  "pimoroni": "Pimoroni",
  "adafruit": "Adafruit",
  "pihut": "ThePiHut"
};

var runPromises = function() {
  var promises = [promiseMe("pimoroni"), promiseMe("pihut"), promiseMe("adafruit"),];
  RSVP.all(promises)
  .then(function(results) {

    var values = "";
    results.forEach(function(v) {
      if(!v.status) {
        values+="<li class=\"list-group-item list-group-item-warning\"> Refreshing " + nameMappings[v.name] + "</li>\n";
      } else {
        var classes = "list-group-item";
        if(v.status.stock) {
          classes += " list-group-item-success";
        } else {
          classes += " list-group-item-danger";
        }

        var newli = "<li class=\""+classes+"\"> <b>";
        newli += "<a href=\"" + storeMappings[v.name] + "\" target=\"_blank\">" + nameMappings[v.name] + "</a>";
        newli += "</b> "+ (v.status.stock ? "in stock" : "out of stock")+"\n";
        if(v.status.totalAmount) {
           newli += " <span class=\"badge\">" + v.status.totalAmount + " units</span>";
        }
        newli += "</li>\n";
        values += newli;
      }
    });
    $("#statusList").html(values);
  })
  .catch(function(error) {
    $("#statusList").text("Error loading: "+ error);
  });
};
runPromises();

setInterval(function() {
  runPromises();
}, 1500);
