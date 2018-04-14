  function checkClash(slots) {

    var timeTableArray = $(".timeTable .slotNames").toArray();
    var clashed = false;
    var clashingSlots = [];
    for (var i = 0; i < slots.length; i++) {
      for (var j = 0; j < slotArray.length; j++) {
        if(slotArray[j] == slots[i]){
          if($(timeTableArray[j]).hasClass("addingDone")){
            $(timeTableArray[j]).addClass("clashBlink");
            clashed = true;
            console.log();
            clashingSlots.push(slots[i]);
          }
        }
      }
    }
    if(clashed == false){
      return 1;
    }else{
      $(".clashingText").css("display","block");
      $(window).scrollTop($(".clashingText").offset().top);
      $(".clashingText span").html(clashingSlots);
      return 0;
  }
  }
$(".clashingText button").click(function(){
  $(".clashingText").css("display","none");
  var timeTableArray = $(".timeTable .slotNames").toArray();
  for(i = 0; i< timeTableArray.length;i++){
    $(timeTableArray[i]).removeClass("clashBlink");
  }
}
);
