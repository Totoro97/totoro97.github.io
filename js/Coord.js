var Coord = function() {
    var geo_x = new THREE.Geometry();
    var geo_y = new THREE.Geometry();
    var geo_z = new THREE.Geometry();
    geo_x.vertices.push(new THREE.Vector3(0, 0, 0));
    geo_x.vertices.push(new THREE.Vector3(1, 0, 0));
    geo_y.vertices.push(new THREE.Vector3(0, 0, 0));
    geo_y.vertices.push(new THREE.Vector3(0, 1, 0));
    geo_z.vertices.push(new THREE.Vector3(0, 0, 0));
    geo_z.vertices.push(new THREE.Vector3(0, 0, 1));
    this.axi_x = new THREE.Line(geo_x, new THREE.LineBasicMaterial({ color: 0xFF0000 }));
    this.axi_y = new THREE.Line(geo_y, new THREE.LineBasicMaterial({ color: 0x00FF00 }));
    this.axi_z = new THREE.Line(geo_z, new THREE.LineBasicMaterial({ color: 0x0000FF }));

    this.addScene = function(scene) {
        scene.add(this.axi_x);
        scene.add(this.axi_y);
        scene.add(this.axi_z);
    }
}