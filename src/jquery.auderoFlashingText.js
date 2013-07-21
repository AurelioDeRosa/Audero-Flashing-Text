/*
 * Audero Flashing Text is a cross-browser jQuery plugin that creates
 * the effect of a flashing, randomly-placed and randomly-sized text inside
 * a given HTML element (typically a <div>).
 *
 * @author  Aurelio De Rosa <aurelioderosa@gmail.com>
 * @version 2.0.0
 * @link    https://github.com/AurelioDeRosa/Audero-Flashing-Text
 * @license Dual licensed under MIT (http://www.opensource.org/licenses/MIT)
 * and GPL-3.0 (http://opensource.org/licenses/GPL-3.0)
 */
(function ($) {
   // Private properties and methods
   var dataAttributeName = "audero-flashing-text";
   var animateText = function ($element, index) {
      // Save the last used index. In this way, if the user disables the animation,
      // once it run again, the plugin know the last used string
      $.extend($element.data(dataAttributeName), {lastIndex: index});
      var options = $element.data(dataAttributeName);
      var $text = $("<span>")
         .text(options.strings[index])
         .css({
            position: "absolute",
            display: "none",
            fontSize: (Math.random() * options.fontMaxSize + options.fontMinSize) + options.fontUnit
         })
         .appendTo($element)
         .fadeIn(options.fadeIn)
         .animate({opacity: 1}, options.duration) // Simulate delay
         .fadeOut(options.fadeOut, function () {
            // Remove the current element
            $(this).remove();
            var nextIndex;
            if (options.selection === "ascending") {
               nextIndex = (index + 1) % options.strings.length;
            } else if (options.selection === "descending") {
               nextIndex = (index === 0) ? options.strings.length : index - 1;
            } else {
               nextIndex = Math.floor(Math.random() * options.strings.length);
            }

            if (options.repeat > 0) {
               options.repeat--;
            }
            // Generate a random pause
            var time = (options.pause === "random") ? Math.random() * 3000 : options.pause;

            $element.data(dataAttributeName, options);
            // If the animation is enabled test if it should run again
            if (options.isEnabled === true) {
               // If the repetition limit is not reached, the animation method will run again
               if (options.repeat !== 0) {
                  setTimeout(function () { animateText($element, nextIndex); }, time);
               } else {
                  methods.destroy.apply([$element]);
               }
            }
         });
      // Set the position so the element will fit the box's size
      var posX = Math.floor(Math.random() * ($element.width() - $text.outerWidth()));
      var posY = Math.floor(Math.random() * ($element.height() - $text.outerHeight()));
      // Set the position of the text
      $text.css({
         left: posX + "px",
         top: posY + "px"
      });
   };
   var isRunning = function ($element) {
      var options = $element.data(dataAttributeName);
      return (options !== undefined && options.isEnabled === true);
   };

   // Public methods
   var methods = {
      init: function (options) {
         if (typeof options === "undefined" || options === null) {
            options = {};
         }
         if (options.strings == null && this.find(':first').length !== this.length) {
            $.error("To run jQuery.auderoFlashingText if you don't specify the texts to show, each element must have at least a child");
            return;
         }
         // By default the order is ascending
         var index = 0;
         if (options.selection === "descending") {
            index = options.strings.length - 1;
         } else if (options.selection === "random") {
            index = Math.floor(Math.random() * options.strings.length);
         }
         options = $.extend(true, {}, $.fn.auderoFlashingText.defaults, options);

         // Check if the properties have valid values
         if (options.fadeIn < 0) {
            $.error("The fadeIn property of jQuery.auderoFlashingText can't be a negative number");
            return;
         }
         if (options.duration < 0) {
            $.error("The duration property of jQuery.auderoFlashingText can't be a negative number");
            return;
         }
         if (options.fadeOut < 0) {
            $.error("The fadeOut property of jQuery.auderoFlashingText can't be a negative number");
            return;
         }
         if ($.inArray(options.selection, ["random", "ascending", "descending"]) < 0) {
            $.error("The selection property of jQuery.auderoFlashingText should have one of these values: random, ascending, descending");
            return;
         }
         if (options.repeat <= 0 && options.repeat !== -1) {
            $.error("jQuery.auderoFlashingText should run at least one time");
            return;
         }
         if (options.pause !== "random" && options.pause < 0) {
            $.error("jQuery.auderoFlashingText should run the animation with a pause equal to or greater than zero");
            return;
         }
         if (options.speed <= 0) {
            $.error("jQuery.auderoFlashingText should run the animation with a speed greater than zero");
            return;
         }
         if (options.fontMinSize <= 0) {
            $.error("The fontMinSize property of jQuery.auderoFlashingText can't be a negative number");
            return;
         }
         if (options.fontMaxSize <= 0) {
            $.error("The fontMaxSize property of jQuery.auderoFlashingText can't be a negative number");
            return;
         }

         this.css("position", "relative");
         this
            .children()
            .css("visibility", "hidden");
         var $current;
         for (var i = 0; i < this.length; i++) {
            $current = $(this[i]);
            if(options.strings === null) {
               options.strings = $current.children().map(function() {
                  return $(this).text();
               });
            }
            // Clone the options object so elements will have the same values without sharing the same object
            $current.data(dataAttributeName, $.extend(true, {}, options));
            if (options.isEnabled === true) {
               animateText($current, index);
            }
         }

         return this;
      },
      enable: function () {
         var $current;
         for (var i = 0; i < this.length; i++) {
            $current = $(this[i]);
            if (!isRunning($current)) {
               $current.data(dataAttributeName).isEnabled = true;
               animateText($current, $current.data(dataAttributeName).lastIndex);
            }
         }

         return this;
      },
      disable: function () {
         var $current;
         for (var i = 0; i < this.length; i++) {
            $current = $(this[i]);
            if (isRunning($current)) {
               $current.data(dataAttributeName).isEnabled = false;
               $current.stop(true, true);
            }
         }

         return this;
      },
      toggle: function () {
         var $current;
         for (var i = 0; i < this.length; i++) {
            $current = $(this[i]);
            if (isRunning($current)) {
               methods.disable.apply([$current]);
            } else {
               methods.enable.apply([$current]);
            }
         }

         return this;
      },
      destroy: function () {
         for (var i = 0; i < this.length; i++) {
            var $current = $(this[i]);
            if (isRunning($current)) {
               // Removes the floating text
               $current
                  .children(":animated")
                  .stop(true)
                  .fadeOut($current.data(dataAttributeName).fadeOut)
                  .remove();
            }
            $current
               .css("position", "inherit")
               .removeData(dataAttributeName);
            // Restore the default visibility
            this
               .children()
               .css("visibility", "visible");
         }

         return this;
      }
   };

   $.fn.auderoFlashingText = function (method) {
      if (methods[method]) {
         return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
         return methods.init.apply(this, arguments);
      } else {
         $.error("Method " + method + " does not exist on jQuery.auderoFlashingText");
      }
   };

   $.fn.auderoFlashingText.defaults = {
      strings: null,       // array (optional). A set of strings to show.
      isEnabled: true,     // boolean (optional). The state of the animation. If the value is false, the animation will stop keeping its current options.
      fadeIn: 300,         // number (optional). The time in milliseconds the element appears by fading to opaque.
      duration: 500,       // number (optional). The time of milliseconds the element stays visible.
      fadeOut: 300,        // number (optional). The time of milliseconds the element disappears by fading to transparent.
      selection: "random", // string (optional). The order of selection of the strings. The possible values are: "random", "ascending", "descending".
      repeat: -1,          // number (optional). The number of times to repeat the animation. -1 means unlimited
      pause: 0,            // number (optional). The time (milliseconds) between animations. Set to "random" to have a random time
      fontMinSize: 7,      // number (optional). The minimum font's size of the strings
      fontMaxSize: 28,     // number (optional). The maximum font's size of the strings
      fontUnit: "px"       // string (optional). The unit to use for the font's size. The value accepted are all those accepted by the browsers, for example: "px", "em", "rem" and so on.
   };
})(jQuery);