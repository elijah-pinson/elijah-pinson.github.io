import java.util.Iterator;

int numBalls = 0;
float spring = 0.1;
float gravity = 0.03;
float friction = -0.9;
//Ball[] balls = new Ball[numBalls];
ArrayList<Ball> balls = new ArrayList<Ball>();


void setup() {
  size(350, 360);
  /*
  for (int i = 0; i < numBalls; i++) {
    balls.add(new Ball(random(width), random(height), random(30, 70), i, balls));
  }
  */
  noStroke();
  fill(255, 204);
  
  PFont f;
  f = createFont("Arial",16,true); // Arial, 16 point, anti-aliasing on
  textFont(f);
  fill(255);
}

void draw() {
  background(100);
  drawPianoKeys();
  for (int i = 0; i < balls.size(); i++) {
    //System.out.println(i);
    balls.get(i).collide();
    balls.get(i).move();
    balls.get(i).display();  
  }
}

int space = 50;
int value = 0;

void drawPianoKeys() {
  for (int x = 0; x <= width; x = x + space ){
    fill(255);
    rect(x - 50,0,x,height);
  }
  fill(0);
  stroke(0);
  rect(35, 0, 30, 250);
  rect(85, 0, 30, 250);
  rect(185, 0, 30, 250);
  rect(235, 0, 30, 250);
  rect(285, 0, 30, 250);
  rect(385, 0, 30, 250);
}

String keypress() {
  
  //C
  if (mouseX < 35 && mouseY < 250 || mouseX < 50 && mouseY > 250){
//    song = minim.loadFile("Do1.mp3");
//    song.play();
    value = 1;
    return "c";
  }
  
  
  //D
  if (mouseX > 65 && mouseX < 85 && mouseY < 250){
//    song = minim.loadFile("Re1.mp3");
//    song.play();
    value = 1;
    return "d";
  }
  if (mouseY > 250 && mouseX > 50 && mouseX < 100 || value == 1){
//    song = minim.loadFile("Re1.mp3");
//    song.play();
    value = 0;
    return "d";
  }
  
  
  //E
  if (mouseX > 115 && mouseX < 150 && mouseY < 250){
//    song = minim.loadFile("Mi1.mp3");
//    song.play();
    value = 2;
    return "e";
  }
  if ( mouseY > 250 && mouseX > 100 && mouseX < 150 || value == 2){
//    song = minim.loadFile("Mi1.mp3");
//    song.play();
    value = 0;
    return "e";
  }
  
  
  //F
  if (mouseX > 150 && mouseX < 185 && mouseY < 250){
//    song = minim.loadFile("Fa1.mp3");
//    song.play();
    value = 3;
    return "f";
  }
  if (mouseY > 250 && mouseX > 150 && mouseX < 200 || value == 3){
//    song = minim.loadFile("Fa1.mp3");
//    song.play();
    value = 0;
    return "f";
  }
  
  //G
  if (mouseX > 215 && mouseX < 235 && mouseY < 250){
//    song = minim.loadFile("Sol1.mp3");
//    song.play();
    value = 4;
    return "g";
  }
  if (mouseY > 250 && mouseX > 200 && mouseX < 250 || value == 4){
//    song = minim.loadFile("Sol1.mp3");
//    song.play();
    value = 0;
    return "g";
  }
   
  //A
  if (mouseX > 265 && mouseX < 285 && mouseY < 250){
//    song = minim.loadFile("La1.mp3");
//    song.play();
    value = 5;
    return "a";
  }
  if (mouseY > 250 && mouseX > 250 && mouseX < 300 || value == 5){
//    song = minim.loadFile("La1.mp3");
//    song.play();
    value = 0;
    return "a";
  }
   
   
  //B
  if (mouseX > 315 && mouseX < 350 && mouseY < 250){
//    song = minim.loadFile("Si1.mp3");
//    song.play();
    value = 6;
    return "b";
  }
  if (mouseY > 250 && mouseX > 300 && mouseX < 350 || value == 6){
//    song = minim.loadFile("Si1.mp3");
//    song.play();
    value = 0;
    return "b";
  }
   
  //C2
  if (mouseX > 350 && mouseX < 385 && mouseY < 250){
//    song = minim.loadFile("Do2.mp3");
//    song.play();
    value = 7;
    return "c2";
  }
  if (mouseY > 250 && mouseX > 350 && mouseX < 400 || value == 7){
//    song = minim.loadFile("Do2.mp3");
//    song.play();
    value = 0;
  }
  

   
  // I bemolli
  //do#
  if ( mouseX > 35 && mouseX < 65 && mouseY < 250){
//    song = minim.loadFile("Do#1.mp3");
//    song.play();
    return "c#";
    
  }
  //re#
   
  if ( mouseX > 85 && mouseX < 115 && mouseY < 250){
//    song = minim.loadFile("Re#1.mp3");
//    song.play();
      
    return "d#";
  }
  // fa#
  if ( mouseX > 185 && mouseX < 215 && mouseY < 250){
//    song = minim.loadFile("Fa#1.mp3");
//    song.play();

    return "f#";
  }
  // sol#
  if ( mouseX > 235 && mouseX < 265 && mouseY < 250){
//    song = minim.loadFile("Sol#1.mp3");
//    song.play();
      
    return "g#";
  }
  //la#
  if ( mouseX > 285 && mouseX < 315 && mouseY < 250){
//    song = minim.loadFile("La#1.mp3");
//    song.play();  
      
    return "a#";
  }
  
  return "";
}

void mouseClicked() {
  String temp = keypress();
  makeball(temp);
  //charlist.add(temp);
  //System.out.println(charlist);
}

/*
void keyPressed() {
  String thekey = "" + key;
  makeball(thekey); 
}
*/
void makeball(String thekey) {
  boolean make_new = true;
   for(Iterator<Ball> it = balls.iterator(); it.hasNext();) {
   Ball ball = it.next();
   if(ball.letter.equals(thekey)) {
     ball.increase_size();
     make_new = false;
   }    
 }
 
 if(make_new) {
   balls.add(new Ball(random(width), random(height), 40, numBalls, balls, thekey));
   numBalls++;
 }
}

class Ball {
  
  float x, y;
  float diameter;
  float vx = 0;
  float vy = 0;
  int id;
  String letter;
  //Ball[] others;
  ArrayList<Ball> others;
 
  Ball(float xin, float yin, float din, int idin, ArrayList<Ball> oin, String let) {
    x = xin;
    y = yin;
    diameter = din;
    id = idin;
    others = oin;
    letter = let;
  } 
  
  void increase_size(){
    diameter += 5;
  }
  
  void collide() {
    for (int i = id + 1; i < balls.size(); i++) {
      float dx = others.get(i).x - x;
      float dy = others.get(i).y - y;
      float distance = sqrt(dx*dx + dy*dy);
      float minDist = others.get(i).diameter/2 + diameter/2;
      if (distance < minDist) { 
        float angle = atan2(dy, dx);
        float targetX = x + cos(angle) * minDist;
        float targetY = y + sin(angle) * minDist;
        float ax = (targetX - others.get(i).x) * spring;
        float ay = (targetY - others.get(i).y) * spring;
        vx -= ax;
        vy -= ay;
        others.get(i).vx += ax;
        others.get(i).vy += ay;
      }
    }   
  }
  
  void move() {
    vy += gravity;
    x += vx;
    y += vy;
    if (x + diameter/2 > width) {
      x = width - diameter/2;
      vx *= friction; 
    }
    else if (x - diameter/2 < 0) {
      x = diameter/2;
      vx *= friction;
    }
    if (y + diameter/2 > height) {
      y = height - diameter/2;
      vy *= friction; 
    } 
    else if (y - diameter/2 < 0) {
      y = diameter/2;
      vy *= friction;
    }
  }
  
  void display() {
    fill(255, 204);
    ellipse(x, y, diameter, diameter);
    fill(0);
    textAlign(CENTER);
    text(letter, x, y);
  }
}
