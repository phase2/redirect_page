/*
 * external_links.js
 *
 * Drupal.settings used
 * --------------------
 *
 *  * redirect_page_safe_href_regexp
 *      used to identify safe links.
 *
 *  * redirect_node_path
 *      path to node used for redirection
 *
 *  * redirect_new_window
 *      whether to external links in a new window or not
 *
 */
(function($) {

Drupal.behaviors.ready_gov_external_links = {
  attach: function(context, settings) {

    // settings
    var safe_href_regexp,
        redirect_node_path,
        redirect_new_window;

    // if someone is specifying Drupal.settings.safe_href_regexp, 
    // use that.
    if (Drupal.settings.redirect_page_safe_href_regexp) {
      safe_href_regexp = new RegExp(Drupal.settings.redirect_page_safe_href_regexp);
    } else {
      safe_href_regexp = new RegExp("(\.gov|\.mil)");
    }

    // set up default redirect path if non is specified
    if (Drupal.settings.redirect_node_path) {
      redirect_node_path = Drupal.settings.redirect_node_path;
    } else {
      redirect_node_path = "/redirect";
    }

    redirect_new_window = Drupal.settings.redirect_new_window || true;

    /** 
     * hasAttr
     *
     * return a closure that tests to see if a jquery object has an attribute
     * `a` to be used by jQuery's filter
     */
    function hasAttr(a) { 
      return function(index) { 
        var attr = $(this).attr(a);
        return (typeof attr !== 'undefined' && attr !== false) ? true : false;
      };
     }

    /**
     * isExternalHref
     *
     * determines if string `hrefStr` is an external URL or not.
     */
    function isExternalHref(hrefStr) {
      return (hrefStr.match(/^(\/|#|mailto:)/)) ? false : true;
    }

    /**
     * isSafeHref
     *
     * determine if string `hrefStr` is government affiliated.
     */
    function isSafeHref(hrefStr) {
      return (hrefStr.match(safe_href_regexp)) ? true : false;
    }

    // Loop over all anchors, filter based on presence of href, decide which
    // links are safe and which aren't, modify the unsafe links.
    $("a", context).filter(hasAttr("href")).each(function() {
      var href = $(this).attr('href');

      // if we've got an unsafe link
      if (isExternalHref(href) && !isSafeHref(href)) {
        var newHref = redirect_node_path + "?url=" + encodeURIComponent(href);
        $(this).attr('href', newHref);

        if (redirect_new_window) 
          $(this).attr('target', '_blank');
      }
    });

  }
};

}(jQuery));

