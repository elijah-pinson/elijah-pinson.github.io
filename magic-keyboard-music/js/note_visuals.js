function spawnNote(note, size, x) {
	var offset = $("#canvasid").offset();

	//320 is middle width
    var px = x - offset.left;
    var py = height - 50 - offset.top;

    var side_len = size/30;

    var rand_x = (Math.random()*2 - 1)/30;
    world.add(Physics.body("circle",{
            x: px,
            y: py,
            // vertices: [
            //     {x:0, y:0},
            //     {x:0, y:side_len},
            //     {x:side_len, y:side_len},
            //     {x:side_len, y:0}

            // ],
            fillStyle: 'hsla(20, 37%, 57%, 0.8)',
            radius: side_len,
            restitution:0.5,
    }).applyForce(Physics.vector(rand_x,-0.1)));

}