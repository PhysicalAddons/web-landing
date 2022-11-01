var General = (function (window) {

  function initialize() {
    _setFocusMethodForLinks();
    _passReferalCodeToLinks();
  }

  function _setFocusMethodForLinks() {
    var links = document.querySelectorAll('a, [tabindex="0"]');
    links.forEach(function(link) {
      link.addEventListener('mousedown', () => {
        link.setAttribute('data-focus-method', 'mouse');
      });
      // link.addEventListener('touchstart', () => {
      //   link.setAttribute('data-focus-method', 'touch');
      // });

      link.addEventListener('blur', () => {
        link.removeAttribute('data-focus-method');
      });
      // link.addEventListener('touchend', () => {
      //   link.removeAttribute('data-focus-method');
      // });
    })
  }

  function _passReferalCodeToLinks() {
    
    var url = new URL(window.location);
    var rcode = url.searchParams.get("v");
    if(rcode!==null) {
      var bmlinks = document.querySelectorAll("a[href*='blendermarket']")
      bmlinks.forEach(function(link) {
        href = link.href
        conjugator = href.indexOf('?') !== -1 ? '&' : '?'
        link.setAttribute('href', href+conjugator+'ref='+rcode);
      })
    }
  }

  return {
    init: initialize
  };
})(window);

General.init();




