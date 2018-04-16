$(document).ready(function() {
  var searchRes = [];

  //Ajax call to fetch filtered courses
  $("#ajaxCall").click(function() {
    $(".cont").html("");
    $.ajax({
      type: 'POST',
      data: {
        search: $("#input").val(),
        type: $("input[name=searchType]:checked").val()
      },
      url: "/getit",
      dataType: "text",
      success: function(data) {
        searchRes = JSON.parse(data);
        if (searchRes.length > 0) {

          for (i = 0; i < searchRes.length; i++) {
            $(".cont").append("<li id = " + searchRes[i].CODE + " class= 'col-2' value = " + searchRes[i]._id + "><strong>Title: </strong> " + searchRes[i].TITLE +
              "<br><strong> FACULTY: </strong>  " + searchRes[i].FACULTY +
              "<br><strong> SLOT: </strong> <span class='slot'> " + searchRes[i].SLOT +
              "</span><br><strong> CREDITS:  " + searchRes[i].CREDITS + "</strong><br>" +
              "<strong> VENUE: </strong>  " + searchRes[i].VENUE + "<strong>&nbsp&nbspTYPE:" + "</strong>" + searchRes[i].TYPE + "<span></li>");
          }


        } else {
          $(".cont").html("<strong>Abe kuch valid likh na gawaar.</strong>");
        }
      },
      error: function(err) {
        console.log("Error Aa rha hai: " + err);
      }
    });

  });

  var addedCourses = [];
  //Onclick Course
  $(".cont").on("click", "li", function(e) {
    var thisE = this;
    //ajax request addElement
    $.ajax({
      type: 'POST',
      data: {
        id: $(this).attr("value")
      },
      url: '/addElement',
      datatype: 'text',
      success: function(data) {
        if (checkElementExist(thisE, addedCourses)) {
          alert("Course Already Added");
        } else {
          if (data.TYPE.indexOf("E") != -1) {
            //if selected Element is embedded
            ajaxCallFindotherEmbedded(data.CODE, data.FACULTY, data.TYPE, data, thisE);
            $("#id0").css("display", "block");

          } else {

            var s1 = $.trim($($($.parseHTML($(thisE).html()))[8]).html());
            var slots = s1.split("+");

            if (checkClash(slots)) {

              addedCourses.push(thisE);
              var x = [thisE];
              addToTimetable(x);
              updateListBeta(addedCourses);
              displayImg($(".doneContainer"));
            }
          }
        }
      }
    });
  });

  function displayImg(cont) {
    cont.fadeIn();
    setTimeout(function() {
      cont.fadeOut();
    }, 700);
  }

  $(".embeddedPopupContainer button").click(function() {
    $(".embeddedPopupContainer").css("display", "none");
  });

  $(document).on("click", ".removeButton", function() {
    removeFromTimetable(this);
    addedCourses.splice($(this).attr("value"), 1);
    updateListBeta(addedCourses);
    displayImg($(".removeContainer"));
  });

  //Search Type state changed function
  $("input[name=searchType]").change(function() {
    $("#input").attr("placeholder", $("input[name=searchType]:checked").val());
  });

  function ajaxCallFindotherEmbedded(courseCode, faculty, type, data1, thisE) {

    $.ajax({
      type: 'POST',
      data: {
        courseCode: courseCode,
        faculty: faculty
      },
      url: "/getEmbedded",
      dataType: "text",
      success: function(data) {


          $(document).off('click', "#id0 .embeddedPopup li");
            $(document).off('click', "#id1 .embeddedPopup li");
        var filteredJSON = JSON.parse(data);
        //Set text of .embeddedPopupText
        var x = 0;
        $(".embeddedPopup").html("");

        //Check whether the selected elemtn has 3 types or 2 types
        var types = []
        for (i = 0; i < filteredJSON.length; i++) {
          if (filteredJSON[i].TYPE == "EPJ" && filteredJSON[i].TYPE != type && types.indexOf(filteredJSON[i].TYPE) == -1) {
            types.push(filteredJSON[i].TYPE);
          } else if (filteredJSON[i].TYPE == "ELA" && filteredJSON[i].TYPE != type && types.indexOf(filteredJSON[i].TYPE) == -1) {
            types.push(filteredJSON[i].TYPE);
          } else if (filteredJSON[i].TYPE == "ETH" && filteredJSON[i].TYPE != type && types.indexOf(filteredJSON[i].TYPE) == -1) {
            types.push(filteredJSON[i].TYPE);
          }
        }
        var numberOfTypes = types.length;
        for (j = 0; j < types.length; j++) {
          $("#id" + j + " .embeddedPopupText").html("Select the corresponding " + types[j]);
          //Loop through the types(multi window)
          for (i = 0; i < filteredJSON.length; i++) {
            //loop through recieved data

            if (filteredJSON[i].TYPE == types[j]) {

              $("#id" + j + " .embeddedPopup").append("<li id = " + filteredJSON[i].CODE + " class= 'col-2' value = " + filteredJSON[i]._id + "><strong>Title: </strong> " + filteredJSON[i].TITLE +
                "<br><strong> Faculty: </strong>  " + filteredJSON[i].FACULTY +
                "<br><strong> SLOT: </strong> <span class='slot'> " + filteredJSON[i].SLOT +
                "</span><br><strong> CREDITS:  " + filteredJSON[i].CREDITS + "</strong><br>" +
                "<strong> VENUE: </strong>  " + filteredJSON[i].VENUE + "<strong>&nbsp&nbspTYPE: " + "</strong>" + filteredJSON[i].TYPE + "<span></li>");
              x++;
              if (x % 3 == 0) {
                $(".embeddedPopup").append("<br>");
              }
            }
          }
        }
        if (numberOfTypes == 2) {
          var x1;
          var x2;
          $(document).on("click", "#id0 .embeddedPopup li", function() {
            $("#id0").css("display", "none");
            $("#id1").css("display", "block");
            x1 = this;

          });
          $(document).on("click", "#id1 .embeddedPopup li", function() {
            $(".embeddedPopupContainer").css("display", "none");
            x2 = this;
            var s1 = $.trim($($($.parseHTML($(thisE).html()))[8]).html());
            var s2 = $.trim($($($.parseHTML($(x1).html()))[8]).html());
            var s3 = $.trim($($($.parseHTML($(x2).html()))[8]).html());

            var slots = s1.split("+");
            slots = slots.concat(s2.split("+"));
            slots = slots.concat(s3.split("+"));

            if (checkClash(slots)) {

              addedCourses.push(x1);
              addedCourses.push(x2);
              addedCourses.push(thisE);
              var tempAddArray = [thisE, x1, x2];
              addToTimetable(tempAddArray);
              updateListBeta(addedCourses);
              displayImg($(".doneContainer"));
            }
          });
        } else {
          $(document).on("click", "#id0 .embeddedPopup li", function() {
            $(".embeddedPopupContainer").css("display", "none");

            //slots array
            var s1 = $.trim($($($.parseHTML($(thisE).html()))[8]).html());
            var s2 = $.trim($($($.parseHTML($(this).html()))[8]).html());
            var slots = s1.split("+");
            slots = slots.concat(s2.split("+"));

            var tempAddArray = [thisE, this];
            if (checkClash(slots)) {
              addedCourses.push(this);
              addedCourses.push(thisE);

              addToTimetable(tempAddArray);
              updateListBeta(addedCourses);
              displayImg($(".doneContainer"));
            }
          });
        }
      },
      error: function(err) {
        console.log("Error Aa rha hai: " + err);
      }
    });
  }
  //Update Added Courses list
  function updateListBeta(addedCourses) {

    //addedCourse format = [li element selected1, li element selected2 , ....]
    var tableElement = $(".addedList");
    if (addedCourses.length == 0) {
      tableElement.html(`<tr>
        <th>TITLE</th>
        <th>FACULTY</th>
        <th>VENUE</th>
        <th>SLOT</th>
        <th>CREDITS</th>
        <th></th>
        <tr>
        <td>Please add a course</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        </tr>
        `);
    } else {
      var appendStringAddElement = "";
      tableElement.html(`
    <tr>
      <th>TITLE</th>
      <th>FACULTY</th>
      <th>VENUE</th>
      <th>SLOT</th>
      <th>CREDITS</th>
      <th></th>
      <tr>
    `);
      var totalCredits = 0;
      for (i = 0; i < addedCourses.length; i++) {
        var title = $($(addedCourses[i]).html())[1].textContent;
        var faculty = $($(addedCourses[i]).html())[4].textContent;
        var slot = $($(addedCourses[i]).html())[7].nextSibling.innerHTML;
        var venue = $($(addedCourses[i]).html())[13].textContent;
        var type = $($(addedCourses[i]).html())[15].textContent;
        var code = $(addedCourses[i])[0].id;
        var credits = $($($(addedCourses[i]).html())[10]).html().split("CREDITS: ")[1];
        totalCredits += parseInt(credits);
        appendStringAddElement = "<tr><td id = " + code + ">" + title + "</td><td>" + faculty + "</td><td>" + venue + "</td><td>" + slot + "</td><td>" + credits + "</td><td><button class='removeButton' value=" + i + ">Remove</button></td></tr>";
        tableElement.append(appendStringAddElement);
      }
      $(".totalCreditsRegNum").html(totalCredits);
    }
  }
  //Check if object exists in a List
  function checkElementExist(element, arr) {

    for (i = 0; i < arr.length; i++) {
      if ($(element)[0].id == arr[i].id) {
        return 1;
      }
    }
    return 0;

  }

  $("#input").keyup(function() {

    if ($("#input").val().length >= 2) {
      $.ajax({
        type: 'POST',
        data: {
          tempSearch: $("#input").val(),
          type: $("input[name=searchType]:checked").val()
        },
        url: '/autoComplete',
        datatype: 'text',
        success: function(data) {
          if (data.length != undefined && data.length != 1) {
            $("#input").autocomplete({
              source: data
            });
          }
        }
      });
    }

  });

});
