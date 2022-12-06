var Navigation = (function (window) {

  function initialize() {
    _showLogoBelowY()
    var toggleBtn = document.querySelector('.nav-primary__toggle')
    toggleBtn.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded')
      expanded = (expanded === 'false')? false : true; // why Boolean('false') is true?
      this.setAttribute('aria-expanded', !expanded)
      if (expanded) {
        document.body.classList.remove('navigation-active')
      } else {
        document.body.classList.add('navigation-active')
      }
    })
  }

  function _showLogoBelowY() {
    var nav = document.querySelector('.nav-secondary')
    var logo = document.querySelector('.nav-secondary__logo')
    if (nav===null) return; 
    document.addEventListener('scroll', function(event){
      if(window.pageYOffset >= nav.offsetTop) {
        if(!logo.classList.contains('nav-secondary__logo--show')) {
          logo.classList.add('nav-secondary__logo--show')
        }
      } else {
        if (nav.offsetTop - window.pageYOffset  > 80) {
          if(logo.classList.contains('nav-secondary__logo--show')) {
            logo.classList.remove('nav-secondary__logo--show')
          }
        }
      }
    });
  }

  return {
    init: initialize
  };
})(window);

Navigation.init();

// debounce(function(){
//   console.log('artwork width', artwork.offsetWidth)
//   grid.style.gridAutoRows = artwork.offsetWidth+'px'
// },100)