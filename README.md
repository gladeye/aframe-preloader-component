## aframe-preloader-component

[![Version](http://img.shields.io/npm/v/@gladeye/aframe-preloader-component.svg?style=flat-square)](https://npmjs.org/package/@gladeye/aframe-preloader-component)
[![License](http://img.shields.io/npm/l/@gladeye/aframe-preloader-component.svg?style=flat-square)](https://npmjs.org/package/@gladeye/aframe-preloader-component)

A preloading bar that automatically displays while scene assets load.

For [A-Frame](https://aframe.io).

### API

| Property          | Description                                                                   | Default Value    |
| ----------------- | ----------------------------------------------------------------------------- | -------------    |
| type              | type of CSS framework to use - acceptable values are: 'bootstrap' or 'custom' | bootstrap        |
| id                | ID of the auto injected preloader modal                                       | preloader-modal  |
| autoInject        | whether or not to auto-inject the preloader html into the page                | true             |
| target            | the html target selector                                                      | #preloader-modal |
| progressValueAttr | an attribute of the progress bar to set when progress is updated              | aria-valuenow    |
| barProgressStyle  | target css style to set as a percentage on the bar                            | width            |
| bar               | target css style to set as a percentage on the bar                            | width            |
| label             | html class of label in preloader - used to set the percentage                 | #preloader-modal .progress-label |
| labelText         | loading text format {0} will be replaced with the percent progress e.g. 30%   | {0}% Complete    |
| autoClose         | automatically close preloader by default - not supported if clickToClose is set to 'true' | true |
| clickToClose      | whether the user must click a button to close the modal when preloading is finished | false      |
| closeLabelText    | default label text of click to close button                                   | Continue         |
| title             | title of preloader modal. Blank by default                                    |                  |
| debug             | whether or not to enable logging to console                                   | false            |
| disableVRModeUI   | whether or not to disable VR Mode UI when preloading                          | true             |
| slowLoad          | deliberately slow down the load progress by adding 2 second delays before updating progress - used to showcase loader on fast connections and should not be enabled in production | slowLoad |
| doneLabelText     | text to set on label when loading is complete                                 | Done             |

### Examples

See the `examples` folder or https://gladeye.github.io/aframe-preloader-component/ for example usage.

### Installation

#### Browser

Install and use by directly including the [browser files](dist) as well as Bootstrap CSS and JS as well as jQuery 1.12.x:

```html
<head>
  <title>My A-Frame Scene</title>
  
  <!-- Bootstrap Bootswatch theme CSS - other themes available here: https://bootswatch.com -->
  <link rel="stylesheet" href="https://cdn.rawgit.com/thomaspark/bootswatch/gh-pages/slate/bootstrap.min.css" />
  
  <!-- Bootstrap JS Dependencies -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

  <!-- A-Frame JS Dependencies -->
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://cdn.rawgit.com/gladeye/aframe-preloader-component/1.0.2/dist/aframe-preloader-component.min.js"></script>
</head>

<body>
  <a-scene preloader>
    <a-assets>
        <a-asset-item id="model" src="model.obj" preload="true"></a-asset-item>
        <img id="texture1" src="texture1.jpg" crossorigin="anonymous" preload="true">
        <img id="texture2" src="texture2.jpg" crossorigin="anonymous" preload="true">
      </a-assets>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install @gladeye/aframe-preloader-component
```
-->

#### npm

Install via npm:

```bash
npm install @gladeye/aframe-preloader-component
```

Then require and use.

```js
require('aframe');
require('bootstrap');
require('@gladeye/aframe-preloader-component');
```

Make sure that Bootstrap's CSS classes are included in your HTML.
