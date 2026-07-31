var Navigation = (function (window) {

  function initialize() {
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

  return {
    init: initialize
  };
})(window);

Navigation.init();
