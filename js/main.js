var renderer,
    scene,
    camera,
    light;

var velocity = 10; // length per second.
var bias_x = 1.0;
var bias_z = 0.0;
var screen_width = window.innerWidth;
var screen_height = window.innerHeight;
var look_pt;

var bg_time,
    past_time,
    now_time;

var prepare = function() {
    // renderer
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(screen_width, screen_height);
    document.body.appendChild(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(45, screen_width / screen_height, 1, 500);
    camera.position.set(-5, 20, -5);
    look_pt = new THREE.Vector3(0, 0.5, 0);
    camera.lookAt(look_pt);

    // light
    light = new THREE.PointLight(0xFFFFFF, 1, 10000);
    light.position.set(-5, 5, -5);

    scene = new THREE.Scene();
};

var add_wall = function() {
    var material = new THREE.MeshLambertMaterial({color: 0xAAAAAA});
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var block_a = new THREE.Mesh(geometry, material);
    var block_b = new THREE.Mesh(geometry, material);
    block_a.position.set(
        cube.position.x + cube.scale.x * 0.5 - 0.5,
        0.5,
        cube.position.z + cube.scale.z * 0.5 - 0.5
    );

    block_b.position.set(
        cube.position.x + cube.scale.x * 0.5 - 0.5,
        0.5,
        cube.position.z + cube.scale.z * 0.5 - 0.5
    );

    var exp_length = (change_time[cnt + 1] - change_time[cnt]) * 0.001 * velocity;
    if (bias_x > 0.0) {
        block_a.scale.z = exp_length + 1;
        block_b.scale.z = exp_length;
        block_a.position.z += exp_length * 0.5 - 1.5;
        block_b.position.z += exp_length * 0.5 + 1.0;
        block_a.position.x += 1.5;
        block_b.position.x -= 1.5;
        // calibrate
        block_b.scale.z += 0.2;
        block_b.position.z += 0.1;
        block_a.scale.z -= 0.2;
        block_a.position.z -= 0.1;
    }
    else {
        block_a.scale.x = exp_length + 1;
        block_b.scale.x = exp_length;
        block_a.position.x += exp_length * 0.5 - 1.5;
        block_b.position.x += exp_length * 0.5 + 1.0;
        block_a.position.z += 1.5;
        block_b.position.z -= 1.5;
        // calibrate
        block_b.scale.x += 0.2;
        block_b.position.x += 0.1;
        block_a.scale.x -= 0.2;
        block_a.position.x -= 0.1;
    }
    scene.add(block_a);
    scene.add(block_b);

};

var wheel = function() {
    var now_time = new Date().getTime();
    var tmp = bias_x;
    bias_x = bias_z;
    bias_z = tmp;
    var material = new THREE.MeshLambertMaterial({ color: 0x2194ce });
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var new_cube = new THREE.Mesh(geometry, material);
    new_cube.position.set(
        cube.position.x + cube.scale.x * 0.5 - 0.5,
        0.5,
        cube.position.z + cube.scale.z * 0.5 - 0.5
    );
    cube = new_cube;
    scene.add(cube);
    cnt += 1;
};

var animate = function() {
    requestAnimationFrame(animate);
    now_time = new Date().getTime();
    var bias_x_ = bias_x * velocity * (now_time - past_time) * 0.001;
    var bias_z_ = bias_z * velocity * (now_time - past_time) * 0.001;
    cube.scale.x += bias_x_;
    cube.scale.z += bias_z_;
    cube.position.x += bias_x_ * 0.5;
    cube.position.z += bias_z_ * 0.5;
    if (change_time[cnt] < now_time - bg_time) {
        add_wall();
        wheel();
    }

    // camera
    var new_look_pt = new THREE.Vector3(
        cube.position.x + cube.scale.x * 0.5,
        cube.position.y + cube.scale.y * 0.5,
        cube.position.z + cube.scale.z * 0.5
    );

    look_pt.set(
        look_pt.x * 0.9 + new_look_pt.x * 0.1,
        look_pt.y * 0.9 + new_look_pt.y * 0.1,
        look_pt.z * 0.9 + new_look_pt.z * 0.1
    );
    camera.position.copy(look_pt);
    camera.position.x -= 10;
    camera.position.y += 20;
    camera.position.z -= 10;
    camera.lookAt(look_pt);

    // light
    light.position.copy(camera.position);
    // render
    renderer.render(scene, camera);

    // ..
    past_time = now_time;
};

// main stream

prepare();

var src_url = "http://127.0.0.1:8000/CG/three.js/cube/";
var BEATS = JSON.parse;
var material = new THREE.MeshLambertMaterial({ color: 0x2194ce });
var geometry = new THREE.BoxGeometry(1, 1, 1);
var cube = new THREE.Mesh(geometry, material);
var chessboard_url = "https://i.loli.net/2018/02/08/5a7c61d7c47d4.jpg";
var texture = new THREE.TextureLoader().load(chessboard_url);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(10, 10);
var plane = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 1, 1000),
    //new THREE.MeshBasicMaterial({ map: texture })
    new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
);

plane.position.set(0, -0.5, 0);
var change_time = beats;
for (var i = 0; i < change_time.length; i++) {
    change_time[i] *= 1000;
}
//var change_time = [1000, 2000, 3000, 4000, 5000];

var cnt = 0;
cube.position.set(0, 0.5, 0);
scene.add(cube);
scene.add(plane);
scene.add(light);

renderer.render(scene, camera);

var coord = new Coord();
coord.addScene(scene);
document.getElementById("song").onplay=function() {
    past_time = bg_time = new Date().getTime();
    animate();  
};
