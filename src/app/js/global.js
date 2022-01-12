function topMenuСollapse(){
  // $('.navbar-nav>li>a').on('click', function(){
  //   $('.navbar-collapse').collapse('hide');
  // });
  $('.navbar-nav>li').on('click', function(){
    $('.navbar-collapse').collapse('hide');
  });
  $('.navbar-custom').on('click', function(){
    var matMenu = $( ".cdk-overlay-container" ).find('.mat-menu-content');
    if(matMenu.length==0){
      $('.navbar-collapse').collapse('hide');
    }
  });
  $('.container_client').on('click', function(){
    $('.navbar-collapse').collapse('hide');
  });
  $('.Logo').on('click', function(){
    $('.navbar-collapse').collapse('hide');
  });
  // $(window).click(function(e) {
  //   alert(e.target.id); // gives the element's ID
  //   $('.navbar-collapse').collapse('hide');
  // });
}
function navbarCollapseHide() {
  $('.navbar-collapse').collapse('hide');
}

function passwordConfirmationErrorHide(display) {
  $('#passwordConfirmationError').css("display", display);
}
function passwordErrorHide(display) {
  $('#passwordError').css("display", display);
}
