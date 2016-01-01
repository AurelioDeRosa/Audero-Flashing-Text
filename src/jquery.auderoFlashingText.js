'use strict';

(function(factory) {
   if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
   } else if (typeof module === 'object' && module.exports) {
      module.exports = function(root, jQuery) {
         if (jQuery === undefined) {
            jQuery = typeof window !== 'undefined' ? require('jquery') : require('jquery')(root);
         }

         factory(jQuery);

         return jQuery;
      };
   } else {
      factory(jQuery);
   }
}(function($) {
   /**
    * The jQuery plugin namespace
    *
    * @external "jQuery.fn"
    * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
    */

   /**
    * @typedef SettingsHash
    * @type {Object}
    * @property {?string[]} [strings=null] A set of strings to show.
    * @property {boolean} [isEnabled=true] The state of the animation. If the value is <code>false</code>, the
    * animation is in a pause state.
    * @property {number} [fadeIn=300] The number of milliseconds the element appears by fading to opaque
    * @property {number} [duration=500] The number of milliseconds the element stays visible
    * @property {number} [fadeOut=300] The number of milliseconds the element disappears by fading to transparent
    * @property {string} [selection="random"] The order of selection of the strings. The possible values are:
    * <code>"random"</code>, <code>"ascending"</code>, <code>"descending"</code>
    * @property {number} [repeat=-1] The number of times to repeat the animation. <code>-1</code> means unlimited
    * @property {number} [pause=0] The time (milliseconds) between animations. Set to <code>"random"</code> to have
    * a random time
    * @property {number} [fontMinSize=7] The minimum font size of the strings
    * @property {number} [fontMaxSize=28] The maximum font size of the strings
    * @property {string} [fontUnit="px"] The unit to use for the font's size. The value accepted are all those
    * accepted by the browsers, for example: <code>"px"</code>, <code>"em"</code>, <code>"rem"</code> and so on.
    */

   /**
    * @typedef MethodsHash
    * @type {Object}
    * @property {init} init The method to initialize the plugin
    * @property {destroy} destroy The method to stop the animation and clean all the resources
    * @property {disable} disable The method to disable the animation
    * @property {enable} enable The method to enable the animation
    * @property {toggle} toggle The method to toggle the animation
    */

   /**
    * The namespace used to store the data
    *
    * @type {string}
    */
   var namespace = 'audero-flashing-text';

   /**
    * Calculates the index of the string to show next
    *
    * @param {number} index The index of the currently shown string
    * @param {SettingsHash} options An object of options to customize the plugin
    *
    * @return {number}
    */
   function getNextIndex(index, options) {
      var nextIndex;

      if (options.selection === 'ascending') {
         nextIndex = (index + 1) % options.strings.length;
      } else if (options.selection === 'descending') {
         nextIndex = index === 0 ? options.strings.length : index - 1;
      } else {
         nextIndex = Math.floor(Math.random() * options.strings.length);
      }

      return nextIndex;
   }

   /**
    * Creates the animation for the element provided
    *
    * @param {jQuery} $element The jQuery collection, containing a single element,
    * on which the string will be shown
    * @param {number} index The index of the string to show
    */
   function animateText($element, index) {
      // Save the last used index. In this way, if the user disables the animation,
      // once it run again, the plugin know the last used string
      var options = $.extend(
         $element.data(namespace),
         {
            lastIndex: index
         }
      );
      var $text = $('<span>')
         .text(options.strings[index])
         .css({
            position: 'absolute',
            display: 'none',
            fontSize: Math.random() * options.fontMaxSize + options.fontMinSize + options.fontUnit
         })
         .appendTo($element)
         .fadeIn(options.fadeIn)
         .animate(
            {
               opacity: 1
            },
            options.duration // Simulate delay
         )
         .fadeOut(options.fadeOut, function() {
            var nextIndex = getNextIndex(index, options);

            // Remove the current element
            $(this).remove();

            if (options.repeat > 0) {
               options.repeat--;
            }

            // Generate a random pause
            var time = options.pause === 'random' ? Math.random() * 3000 : options.pause;

            $element.data(namespace, options);

            // If the animation is enabled test if it should run again
            if (options.isEnabled === true) {
               // If the repetition limit is not reached, the animation method will run again
               if (options.repeat !== 0) {
                  setTimeout(function() {
                     animateText($element, nextIndex);
                  }, time);
               } else {
                  destroy($element);
               }
            }
         });

      // Set the position so the element will fit the box's size
      var posX = Math.floor(Math.random() * ($element.width() - $text.outerWidth()));
      var posY = Math.floor(Math.random() * ($element.height() - $text.outerHeight()));

      // Set the position of the text
      $text.css({
         left: posX,
         top: posY
      });
   }

   /**
    * Tests if the element has an animation running
    *
    * @param {jQuery} $element The jQuery collection, containing a single element, to test
    *
    * @return {boolean}
    */
   function isRunning($element) {
      var options = $element.data(namespace);

      return $.type(options) === 'object' && options.isEnabled === true;
   }

   /**
    * Checks if the options have valid values
    *
    * @param {SettingsHash} options An object of options to customize the plugin
    */
   function validateOptions(options) {
      /* jshint -W074 */
      if (options.fadeIn < 0) {
         $.error('The fadeIn property of jQuery.auderoFlashingText can\'t be a negative number');
      }

      if (options.duration < 0) {
         $.error('The duration property of jQuery.auderoFlashingText can\'t be a negative number');
      }

      if (options.fadeOut < 0) {
         $.error('The fadeOut property of jQuery.auderoFlashingText can\'t be a negative number');
      }

      if ($.inArray(options.selection, ['random', 'ascending', 'descending']) < 0) {
         $.error('The selection property of jQuery.auderoFlashingText should have one of these values: random, ascending, descending');
      }

      if (options.repeat <= 0 && options.repeat !== -1) {
         $.error('jQuery.auderoFlashingText should run at least one time');
      }

      if (options.pause !== 'random' && options.pause < 0) {
         $.error('jQuery.auderoFlashingText should run the animation with a pause equal to or greater than zero');
      }

      if (options.speed <= 0) {
         $.error('jQuery.auderoFlashingText should run the animation with a speed greater than zero');
      }

      if (options.fontMinSize <= 0) {
         $.error('The fontMinSize property of jQuery.auderoFlashingText can\'t be a negative number');
      }

      if (options.fontMaxSize <= 0) {
         $.error('The fontMaxSize property of jQuery.auderoFlashingText can\'t be a negative number');
      }
   }

   /**
    * Initializes the plugin
    *
    * @callback init
    *
    * @param {jQuery} $elements The jQuery collection to work with
    * @param {SettingsHash} options An object of options to customize the plugin
    *
    * @return {jQuery}
    */
   function init($elements, options) {
      /* jshint +W074 */
      if ($.type(options) !== 'object') {
         options = {};
      }

      if (!options.strings && $elements.find(':first').length !== $elements.length) {
         $.error('To run jQuery.auderoFlashingText if you don\'t specify the texts to show, each element must have at least a child');
      }

      // By default the order is ascending
      var index = 0;

      if (options.selection === 'descending') {
         index = options.strings.length - 1;
      } else if (options.selection === 'random') {
         index = Math.floor(Math.random() * options.strings.length);
      }

      options = $.extend({}, $.fn.auderoFlashingText.defaults, options);

      // Check if the properties have valid values
      validateOptions(options);
      $elements
         .css('position', 'relative')
         .children()
         .css('visibility', 'hidden');
      var $current;

      $elements.each(function() {
         $current = $(this);

         if (options.strings === null) {
            options.strings = $current.children().map(function() {
               return $(this).text();
            });
         }

         // Clone the options object so elements will have the same values without sharing the same object
         $current.data(namespace, $.extend({}, options));

         if (options.isEnabled === true) {
            animateText($current, index);
         }
      });

      return $elements;
   }

   /**
    * Immediately completes the currently running animation for each element
    * in the jQuery collection and blocks those left
    *
    * @callback disable
    *
    * @param {jQuery} $elements The jQuery collection to work with
    *
    * @return {jQuery}
    */
   function disable($elements) {
      $elements.each(function() {
         var $current = $(this);

         if (isRunning($current)) {
            $current.data(namespace).isEnabled = false;
            $current.stop(true, true);
         }
      });

      return $elements;
   }

   /**
    * Restarts the animation for each element in the jQuery collection
    *
    * @callback enable
    *
    * @param {jQuery} $elements The jQuery collection to work with
    *
    * @return {jQuery}
    */
   function enable($elements) {
      $elements.each(function() {
         var $current = $(this);

         if (!isRunning($current)) {
            $current.data(namespace).isEnabled = true;
            animateText($current, $current.data(namespace).lastIndex);
         }
      });

      return $elements;
   }

   /**
    * Disables the animation for elements that are currently running it and
    * enables the animation again for elements that are not running it
    *
    * @callback toggle
    *
    * @param {jQuery} $elements The jQuery collection to work with
    *
    * @return {jQuery}
    */
   function toggle($elements) {
      $elements.each(function() {
         var $current = $(this);

         if (isRunning($current)) {
            disable($current);
         } else {
            enable($current);
         }
      });

      return $elements;
   }

   /**
    * Stops the animation and clean all the resources
    *
    * @callback destroy
    *
    * @param {jQuery} $elements The jQuery collection to work with
    *
    * @return {jQuery}
    */
   function destroy($elements) {
      $elements.each(function() {
         var $current = $(this);

         if (isRunning($current)) {
            // Removes the floating text
            $current
               .children(':animated')
               .stop(true)
               .fadeOut($current.data(namespace).fadeOut)
               .remove();
         }

         $current
            .css('position', 'inherit')
            .removeData(namespace);
      });

      // Restore the default visibility
      $elements
         .children()
         .css('visibility', 'visible');

      return $elements;
   }

   /**
    * The object containing all the public methods
    *
    * @type {MethodsHash}
    */
   var methods = {
      init: init,
      enable: enable,
      disable: disable,
      toggle: toggle,
      destroy: destroy
   };

   /**
    * Creates a flashing text effect for one or more elements
    *
    * @function external:"jQuery.fn".auderoFlashingText
    *
    * @param {(SettingsHash|string)} [method] The options to initialize the plugin or the name of the method to call
    *
    * @return {jQuery}
    */
   $.fn.auderoFlashingText = function(method) {
      var args = Array.prototype.slice.call(arguments);

      if (methods[method]) {
         return methods[method].apply(this, [this].concat(args.splice(0, 1)));
      } else if ($.type(method) === 'object' || !method) {
         return methods.init.apply(this, [this].concat(args));
      } else {
         $.error('Method ' + method + ' does not exist on jQuery.auderoFlashingText');
      }
   };

   /**
    * The default options of the plugin
    *
    * @type {SettingsHash}
    */
   $.fn.auderoFlashingText.defaults = {
      strings: null,
      isEnabled: true,
      fadeIn: 300,
      duration: 500,
      fadeOut: 300,
      selection: 'random',
      repeat: -1,
      pause: 0,
      fontMinSize: 7,
      fontMaxSize: 28,
      fontUnit: 'px'
   };
}));