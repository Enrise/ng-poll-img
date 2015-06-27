# ngPollImg
An AngularJS directive which polls the server for an image and shows a fallback until it's available.
It will continuously poll the `source` url, after the initial fail it will put the fallback as `src`, it will continue to try the `source` url and once it gets a 200 OK it will replace `src` with the `source` url.

# Usage
1. Download ng-poll-img.min.js from this repository OR use bower with:

    ```sh
$ bower install ng-poll-img --save
```

2. Include the file in your project's javascript
3. Add it to your AngularJS application:

    ```js
var app = angular.module("myApp", ["ngPollImg"]);
```

4. Use the `<poll-img></poll-img>` directive in your HTML:

    ```html
<poll-img source="http://example.com/2Fd1aZs.jpg" class="img-responsive" fallback="http://placehold.it/1216x400" on-success="success()"></poll-img>
```

# Config
- **source** The source url that you want to load, if the url returns a 200 after the first try it will immediately be shown.
- **fallback** The fallback url that will be used when the source url does not return a 200 after the first try.
- **giveUpAfter** The amount of tries it should do before giving up and just leaving the fallback url active.
- **onSuccess** An expression that will be evaluated once the source url is available.
- **onGivingUp** An expression that will be evaluated once the source url is unavailable and the maximum amount of tries was reached.
