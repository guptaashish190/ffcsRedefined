$(".ffcsRBody").slideUp();
$(".ffcsRedefinedToggle").click(function() {
  $(".ffcsRBody").slideToggle();
  $(".ffcsRedefinedToggle img").toggleClass("rotateImg");
  $(".text").fadeToggle();
});


//Suggest courses
$("#input2").keyup(function() {

  if ($("#input2").val().length >= 2) {
    $.ajax({
      type: 'POST',
      data: {
        tempSearch: $("#input2").val(),
        type: "Course Code"
      },
      url: '/autoComplete',
      datatype: 'text',
      success: function(data) {
        if (data.length != undefined && data.length != 1) {
          $("#input2").autocomplete({
            source: data
          });
        }
      }
    });
  }

});

var selectedCourses = [];

$("#ajaxCall2").click(function() {
  $.ajax({
    type: 'POST',
    data: {
      search: $("#input2").val(),
      type: "Course Code"
    },
    url: "/getit",
    dataType: "text",
    success: function(data) {
      if (data != "[]") {
        let selectedCourse = $("#input2").val();

        if (!selectedCourses.includes(selectedCourse)) {
          selectedCourses.push(selectedCourse);
          $(".addedCoursesCont ul").append(`
              <li>${selectedCourse}</li>
            `);
        }
      } else {
        console.log("nope");
      }
    }
  });
});
//Remove List Elements on click and update
$(document).on("click", ".ffcsRedefined ul li", function(d) {
  selectedCourses.splice($(this).index(), 1);
  $(d.target).fadeOut();
  setTimeout(function() {
    $(d.target).remove();
  }, 3000);
});
