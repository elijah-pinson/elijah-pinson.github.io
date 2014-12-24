$(function() {
	load_front();
	load_projects();
	load_about();
});

function load_front() {
	$("#section1").load("./front.html", function() {
	});
}

function load_projects() {
	$("#section2").load("./projects.html", function() {
	});
}

function load_about() {
	$("#section3").load("./about.html", function() {
	});
}

