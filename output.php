
<div id="<?php echo $options['id'] ?>"<?php if ($options['cssClass']) echo ' class="'.$options['cssClass'].'"'?><?php if ($options['cssStyle']) echo ' style="'.$options['cssStyle'].'"'?>>
    <div style="width: 100%; height:3px; background-color: #8888FF; position:relative; top:50%">
        <div class="bar" style="width: 0%; height:100%; background-color: #FF0000; position:absolute"></div>
    </div>
</div>

<script>

callback = function() {
    options = <?php echo json_encode($options) ?>;
    wp3d = new WP3D('<?php echo $model ?>', options);
    wp3d.render();
}

if(window.addEventListener){
  window.addEventListener('load',callback,false);
} else {
  window.attachEvent('onload',callback);
}

</script>
