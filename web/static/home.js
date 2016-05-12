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

var runPromises = function() {
  Promise.all([promiseMe("pimoroni"), promiseMe("pihut"), promiseMe("pisupply")])
  .then(function(results) {
    console.log(results);
    var values = "";
    results.forEach(function(v) {
      if(!v.status) {
        values+="<li class=\"list-group-item\"> Refreshing "+v.name+"</li>\n";
      } else {
        values+="<li class=\"list-group-item\"> <b>"+v.name+ "</b> "+ (v.status.stock?"in stock":"out of stock")+"</li>\n";
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
