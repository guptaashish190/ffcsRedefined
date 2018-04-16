  function checkClash(slots) {

    var timeTableArray = $(".timeTable .slotNames").toArray();
    var clashed = false;
    var clashingSlots = [];
    var currentSlot;
    var checkLab;
    for (var i = 0; i < slots.length; i++) {
      for (var j = 0; j < slotArray.length; j++) {
        if(slotArray[j] == slots[i]){

          currentSlot = slots[i];
          //Check Lab or not
          if(currentSlot.indexOf('L') != -1){
            checkLab = true;
            console.log($(timeTableArray[j-13]));
          }else   {
            checkLab = false;
            console.log($(timeTableArray[j+13]));
          }

          //Corresponding clash
          if($(timeTableArray[j]).hasClass("addingDone") ){
            $(timeTableArray[j]).addClass("clashBlink");
            clashed = true;
            clashingSlots.push(slots[i]);
          }else if(checkLab == true && $(timeTableArray[j-13]).hasClass("addingDone")){
            $(timeTableArray[j-13]).addClass("clashBlink");
            $(timeTableArray[j]).addClass("clashBlinkPreview");
            clashed = true;
            clashingSlots.push(slots[i]);
          }else if(checkLab == false && $(timeTableArray[j+13]).hasClass("addingDone")){
            $(timeTableArray[j+13]).addClass("clashBlink");
            $(timeTableArray[j]).addClass("clashBlinkPreview");
            clashed = true;
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
      $(timeTableArray[i]).removeClass("clashBlinkPreview");
  }
}
);
