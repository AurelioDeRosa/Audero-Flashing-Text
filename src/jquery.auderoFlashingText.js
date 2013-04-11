/*
 * Audero Flashing Text is a cross-browser jQuery plugin that creates
 * the effect of a flashing, randomly-placed and randomly-sized text inside
 * a given HTML element (tipically a <div>).
 *
 * @author  Aurelio De Rosa <aurelioderosa@gmail.com>
 * @version 1.0.0
 * @link    https://github.com/AurelioDeRosa/Audero-Flashing-Text
 * @license Dual licensed under MIT (http://www.opensource.org/licenses/MIT)
 * and GPL-3.0 (http://opensource.org/licenses/GPL-3.0)
 */
(function($) {
   var defaultValues = {
      strings: [], // array. A set of strings to show.
      fadeIn: 300, // numeric. The time in milliseconds the element appears by fading to opaque.
      duration: 500, // numeric. The time of milliseconds the element stays visible.
      fadeOut: 300, // numeric. The time of milliseconds the element disappears by fading to transparent.
      selection: "random" // string. The order of selection of the strings.
                          // The possible values are: "random", "ascending", "descending".
   };

   var methods = {
      init: function(options)
      {
         if (typeof options === "undefined" || options === null) {
            options = {};
         }
         if (typeof options.strings === "undefined" || options.strings == null) {
            if (this.children().size() === 0) {
               $.error("If you don't specify the texts to show, the element must have at least a child");
               return;
            }
            else {
               options.strings = this.children().map(function() {
                  return $(this).text();
               });
            }
         }

         this.css("position", "relative");
         this.children().css("visibility", "hidden");

         methods.start($.extend({}, defaultValues, options), null, this.attr("id"));
      },
      start: function(settings, index, idElem)
      {
         if (typeof idElem === "undefined") {
            idElem = this.selector;
         }
         if (typeof settings === "undefined") {
            $.error("Invalid method call: No settings specified");
            return;
         }
         if (index == null) {
            if (settings.selection === "ascending")
               index = 0;
            else if (settings.selection === "descending")
               index = settings.strings.length - 1;
            else
               index = Math.floor(Math.random() * settings.strings.length);
         }

         var $text = $("<span>")
         .text(settings.strings[index])
         .addClass("audero-flashing-text") // This is used as a bookmark to help the stop method
         .css({
            position: "absolute",
            display: "none",
            fontSize: (Math.random() * 2 + 0.5) + "em"
         })
         .appendTo("#" + idElem)
         .fadeIn(settings.fadeIn)
         .animate({opacity: 1}, settings.duration) // Simulate delay
         .fadeOut(settings.fadeOut, function() {
            // Remove the current element
            $(this).remove();
            var nextIndex;
            if (settings.selection === "ascending")
               nextIndex = (index + 1) % settings.strings.length;
            else if (settings.selection === "descending")
               nextIndex = (index === 0) ? settings.strings.length : index - 1;
            else
               nextIndex = Math.floor(Math.random() * settings.strings.length);
            // Start again the effect
            methods.start(settings, nextIndex, idElem);
         });
         // Set the position so the element will fit the box's size
         var posX = Math.floor(Math.random() * ($("#" + idElem).width() - $text.outerWidth()));
         var posY = Math.floor(Math.random() * ($("#" + idElem).height() - $text.outerHeight()));
         // Set the position of the text
         $text.css({
            left: posX + "px",
            top: posY + "px"
         });
      },
      stop: function()
      {
         this.css("position", "inherit");
         // Removes the floating text
         this
         .children("span.audero-flashing-text")
         .stop(true)
         .fadeOut(defaultValues.fadeOut)
         .remove();
         // Restore the default visibility
         this.children().css("visibility", "visible");
      },
      isRunning: function()
      {
         return (this.children("span.audero-flashing-text").size() > 0);
      }
   };

   $.fn.auderoFlashingText = function(method) {
      if (methods[method])
         return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      else if (typeof method === "object" || ! method)
         return methods.init.apply(this, arguments);
      else
         $.error("Method " + method + " does not exist on jQuery.auderoFlashingText");
   };
})(jQuery);