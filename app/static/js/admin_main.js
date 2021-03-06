window.onload = function()
{
  var requests = [d3.json("/get_data")]
  Promise.all(requests).then(function(response) {
    stacked_barchart(response)
    streamgraph(response)
    boxplot(response)
    var data_gender = gender_barchart(response)
    barchart(data_gender, ".gender_barchart", ["gender", "value"])
    var data_user_type = user_type_barchart(response)
    barchart(data_user_type, ".user_type_barchart", ["user_type", "value"])
    basic_info(response)
    bullet_chart(response)
    sign_up_linechart(response)
  }).catch(function(e) {
      throw(e);
  });
};

function preview_bb_msg(){
  var bb_msg_title = document.getElementById("bb_msg_title")
  d3.select(".bb_board_title").text(bb_msg_title.value)
  var bb_msg = document.getElementById("bb_msg")
  d3.select(".bb_board_msg").text(bb_msg.value)
  d3.select(".length_text").text(bb_msg.value.length + "/500")
}

function basic_info(response){
  var data = response[0]["basic_stats"]
  d3.select(".num_p")
    .text("Number of participants: " + data["num_p"]);

    d3.select(".num_active_p")
      .text("Number of active participants: " + data["num_active_p"]);
}

function toggle_charts(chart){
  var requests = [d3.json("/get_data")]
  Promise.all(requests).then(function(response) {
    d3.select(".linechart").select("svg").remove();
    d3.select(".streamgraph").select("svg").remove();
    d3.select(".legend").select("svg").remove();
    if (chart == "streamgraph"){
      streamgraph(response)
    }
    else{
      linechart(response)
    }
  }).catch(function(e) {
      throw(e);
  });

}


function legend(keys, color, div, width, height){
  // set the dimensions and margins of the graph
  var margin_legend = {top: 10, right: 10, bottom: 0, left: 10},
  width_legend = width - margin_legend.left - margin_legend.right,
  height_legend = height - margin_legend.top - margin_legend.bottom;
  const legend_svg = d3.select(div)
                      .append('svg')
                      .attr("width", width_legend + margin_legend.left + margin_legend.right)
                      .attr("height", height_legend + margin_legend.top + margin_legend.bottom)
                      .append("g")
                      .attr("transform",
                      "translate(" + margin_legend.left + "," + margin_legend.top + ")");
  const g = legend_svg.append("g")
    .selectAll("g")
    .data(keys)
    .join("g")
      .attr("transform", (d, i) => `translate(${margin_legend.left},${i * 20})`);

  g.append("rect")
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color);

  g.append("text")
      .attr("x", 24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);

}

// parse the date / time
var parseTime = d3.timeFormat("%d-%b-%Y");

function select_user_ajax(){
  $.getJSON("/select_user", {'username': username.value, 'user_id': user_id.value, 'participation_id': participation_id.value}, function(result, state){
    if (state === "success"){
      if (Object.keys(result).length != 0){
        var birthdate = new Date(result["birthdate"])
        var sign_up =  new Date(result['time_sign_up'])
        d3.select(".user").html('<b>User_id:</b> '+ result["user_id"] +
                    '<br> <b>Email:</b> ' + result["email"] +
                    '<br> <b>Gender:</b> ' + result["gender"] +
                    '<br> <b>Birthdate:</b> '+ parseTime(birthdate) +
                    '<br> <b>User_type:</b> ' + result["user_type"] +
                    '<br> <b>Participation_id:</b> ' + result["participation_id"] +
                    '<br> <b>Time_sign_up:</b> ' +  parseTime(sign_up) +
                    '<br> <b>Admin:</b> ' + result['admin'] +
                    '<br> <b>Psytoolkit_id:</b> ' + result['psytoolkit_id'])
      }
      else{
        d3.select(".user").text('No user found')
      }
    }
  });
}

function clear_selection(){
  d3.selectAll('.selection').text("")
}

function pretty_print_users(data){
  users = []
  for (data_item in data){
  var birthdate = new Date(data[data_item][3])
  var sign_up =  new Date(data[data_item][6])
  var user = '<b>User_id:</b> '+ data[data_item][0] +
              ' - <b>Email:</b> ' + data[data_item][1] +
              ' - <b>Gender:</b> ' + data[data_item][2] +
              ' - <b>Birthdate:</b> '+ parseTime(birthdate) +
              ' - <b>User_type:</b> ' + data[data_item][4] +
              ' - <b>Participation_id:</b> ' + data[data_item][5] +
              ' - <b>Time_sign_up:</b> ' +  parseTime(sign_up) +
              ' - <b>Admin:</b> ' + data[data_item][7] + "<br><br>"
    users.push(user)
  }
  return users
}

function query_data_ajax(){
  $.getJSON("/query_data", {'gender': gender.value, 'user_type': user_type.value}, function(result, state){
    if (state === "success"){
      console.log(result)
      if (Object.keys(result).length != 0){
        d3.select(".gender_p").html(pretty_print_users(result))
      }
      else{
        d3.select(".gender_p").text('No user found')
      }
    }
  });
}

function inactive_users_ajax(){
  $.getJSON("/inactive_users", {}, function(result, state){
    if (state === "success"){
      inactive_users_list = []
      for (i in result){
        inactive_users_list.push(JSON.stringify(result[i]) + " <br>")
      }
      d3.select(".inactive_users_p").html(inactive_users_list)
    }
  });
}
