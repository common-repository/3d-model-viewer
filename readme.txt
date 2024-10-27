=== 3D Model Viewer ===
Contributors: joergviola
Donate link: http://www.joergviola.de
Tags: 3d, webgl, threejs, 3d model display, 3D model viewer, 3D Model Viewer WordPress, dae viewer
Requires at least: 4.0.0
Tested up to: 4.2
Stable tag: 1.9
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Easily display your 3D-models. Upload to media gallery, add shortcode - ready!

== Description ==

This plugin allows you to show your 3D models easily in your wordpress blog.

Simply upload the model and all files references (eg. textures) to the wordpress media gallery, 
add a shortcode to the page where the model should be shown and there you go. 

Currently, Collada DAE and OBJ and OBJ/MTL files are supported.
Please file a request for other required file formats.

The 3D stage is highly configurable: Define background, ambient or directional light 
as well as the cameras and your models position and scale.



== Installation ==

Install this plugin from the wordpress plugin directory as usual and activate it.
Add the shortcode [3D], wherever you want your model to appear.
Here are the arguments to this short code:

* model: name of the model file in the media gallery or full URL. Mandatory. Using OBJ/MTL? - Use the material option below to specify path to the mtl file.
* width, height: Size of the 3d stage. If in percent, then relative to the size of the div around the canvas. Optional, default is 500x300.
* background: Background color. Optional, default is "ffffff".
* opacity: Background opacity. Optional, default is 1.
* ambient: Color of ambient light. Optional, default is "404040".
* directional: Direction and color of directional light source. Optional, default is "1,1,1:ffffff"
* modelposition: Point of origin of the model. Optional, default is "0,0,0".
* modelscale: Scale of the model. Optional, default is "1,1,1".
* class: CSS class of div around canvas. Optional, no default.
* style: CSS style of div around canvas. Optional, no default.
* id: id of div around canvas. Optional, default is "stage".
* fps: Number of animation frames per second. Optional, default is 30.
* material: URL of OBJ/MTL file.
* camera: Camera coordinates, default is 50,50,30.
* fov: Camera field-of-view in degrees. Default is 75.

Example:

[3D width="600" height="400" background="436523" opacity="0.5" model="dummy1.dae" camera="50,50,300" modelposition="2,2,2" modelscale="2,2,2" ambient="BBBBBB" directional="1,1,0:FFFF44" class="3d" style="float: right" id="coffee" fps=20]



== Frequently Asked Questions ==

None yet.

== Screenshots ==

1. The plugin in action

== Changelog ==

= 1.9 =
* Parameter rename: model-scale => modelscale, model-position => modelposition
* Multiple 3D stages on one page possible
* New material option for OBJ/MTL
* New fov-parameter

= 1.7 =
* Find models not attached to page or when full URL is given

= 1.6 =
* Bugfix: Show model without interaction. Timing problem fixed. (I hope;-)
* Only load scripts when 3D shortcode present on page.
* Show uploaded models in media manager

= 1.5 =
* OBJ and OBJMTL format supported.
* Performance tuning: Renders only on demand. 


= 1.3 =
* width and size can be reltaive to the size of the div around the canvas (which in turn can be set via CSS). 

= 1.2 =
* Performance after moving camera optimized.

= 1.1 =
* CSS class and style and parameters.
* background opacity parameter. 
* optional id parameter for more than one stage on a page.

= 1.0.0 =
First version of the 3D plugin.
Supports DAE files and extensive configuration of the stage.
