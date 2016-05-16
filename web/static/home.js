function promiseMe(name) {
  var load = new Promise(function(resolve, reject) {
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
  "pimoroni": "https://shop.pimoroni.com/products/raspberry-pi-zero",
  "pihut": "https://thepihut.com/products/raspberry-pi-zero?variant=14062715972",
  "pisupply": "https://www.pi-supply.com/product/raspberry-pi-zero-cable-kit/"
};

var runPromises = function() {
  Promise.all([promiseMe("pimoroni"), promiseMe("pihut"), promiseMe("pisupply")])
  .then(function(results) {
    console.log(results);
    var values = "";
    results.forEach(function(v) {
      if(!v.status) {
        values+="<li class=\"list-group-item list-group-item-warning\"> Refreshing "+v.name+"</li>\n";
      } else {
        var classes = "list-group-item";
        if(v.status.stock) {
          classes += " list-group-item-success";
        } else {
          classes += " list-group-item-danger";
        }

        var newli = "<li class=\""+classes+"\"> <b>";
        newli += "<a href=\"" + storeMappings[v.name] + "\" target=\"_blank\">"+v.name+"</a>";
        newli += "</b> "+ (v.status.stock ? "in stock" : "out of stock")+"</li>\n";
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
}, 1000);



