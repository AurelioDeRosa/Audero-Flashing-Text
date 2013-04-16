# Audero Flashing Text #
[Audero Flashing Text](https://github.com/AurelioDeRosa/Audero-Flashing-Text) is a cross-browser jQuery plugin that creates the effect of a flashing, randomly-placed and randomly-sized text inside a given HTML element (tipically a `<div>`).

## Demo ##
A live demo is available [here](http://htmlpreview.github.io/?https://github.com/AurelioDeRosa/Audero-Flashing-Text/blob/master/demo/index.html).

## Requirements ##
Being a jQuery plugin, the only requirement is [jQuery](http://www.jquery.com).

## Compatibility ##
It has been tested and works on all the major browsers, including Internet Explorer 6 and later.

## Installation ##
To install this plugin you need to include the script **after** the [jQuery](http://www.jquery.com) library in the header of your web page:

    <script src="path/to/jquery.js"></script>
    <script src="path/to/jquery.auderoFlashingText.js"></script>

## Usage ##
Using this plugin is very simple. Just call the `auderoFlashingText()` method on the element you want to apply the effect.
For example, let that you have the following code:

    <div id="box">
       <p>First</p>
       <p>Second</p>
       <p>Third</p>
    </div>

A basic call to the plugin is:

    <script>
       $(document).ready(function () {
          $("#box").auderoFlashingText();
       });
    </script>

### Stop the effect ###
To stop the effect, you have to call the same method seen before (`auderoFlashingText()`) passing a string with value `stop` as you can see in the next example.

    <script>
       $("#box").auderoFlashingText("stop");
    </script>

### Test if the effect is running ###
In some situations, you may need to know if the effect is running on a given element. To satisfy this need, you can call the `auderoFlashingText()` method passing a string with value `isRunning`. It will return `true` if the effect is running, `false` otherwise. To see it in action, look at the following snippet.

    <script>
       $("#box").auderoFlashingText("isRunning");
    </script>

## Options ##
Audero Flashing Text has several options you can set during the call to the `auderoFlashingText()` method that allow you to customize the effect to fit your needs. The options are:

* `strings` (`array`. Default: The text of the selected element's children): A set of strings to show.
* `fadeIn` (`numeric`. Default: `300`): The time in milliseconds the element appears by fading to opaque.
* `duration` (`numeric`. Default: `500`): The time of milliseconds the element stays visible.
* `fadeOut` (`numeric`. Default: `300`): The time of milliseconds the element disappears by fading to transparent.
* `selection` (`string`. Default: `random`): The order of selection of the strings. The possible values are: `random`, `ascending`, `descending`.

## Advanced Examples ##
### Example 1 ###
A basic example that uses some of the options seen in the previous section is:

    <script>
       $(document).ready(function () {
          $("#box").auderoFlashingText({
             strings: ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"],
             fadeOut: 1500,
             duration: 2000,
             selection: "descending"
          });
       });
    </script>

### Example 2 ###
The next example is slightly more complex then the previous. In fact, it shows you how to select the strings to show using the `children()` and `map()` methods of jQuery.
Let that you have this code:

    <div id="box-2">
       <ul>
          <li>Lorem</li>
          <li>Ipsum</li>
          <li>Dolor</li>
          <li>Sit</li>
          <li>Amet</li>
       </ul>
    </div>

You can run the script in this way:

    <script>
       $(document).ready(function () {
          $("#box-2").auderoFlashingText({
             strings: $("#box-2 > ul").children("li").map(function() {
                return $(this).text();
             }),
             fadeOut: 1500,
             selection: "ascending"
          });
       });
    </script>

## License ##
[Audero Flashing Text](https://github.com/AurelioDeRosa/Audero-Flashing-Text) is dual licensed under [MIT](http://www.opensource.org/licenses/MIT) and [GPL-3.0](http://opensource.org/licenses/GPL-3.0)

## Authors ##
[Aurelio De Rosa](http://www.audero.it) ([@AurelioDeRosa](https://twitter.com/AurelioDeRosa))
