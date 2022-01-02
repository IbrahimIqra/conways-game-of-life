let rows, cols,
  patterns,
  sel,reset_button,start_button,speed_slider,
  btn_x,btn_y,btn_endX,btn_endY,
  world,
  fr=9;

function setup() {

  createCanvas(screen.width,screen.height);
  background(255);
  cols = Math.ceil(screen.width/Cell.size);
  rows = Math.ceil(screen.height/Cell.size);

  createWorld();
  if (deviceType()=='desktop'){
    alert('Press F11 for fullscreen');
  }
}

function draw() { 

  reset_button.mousePressed(resetWorld);
  start_button.mousePressed(startLife);
  sel.changed(patternChanged);

  if(world.life){
    fr = speed_slider.value();
    frameRate(fr);
    world.drawGrid();
  }
  else{
    frameRate(30);
  }

}

function patternChanged(){
  world.current_pattern = int(sel.value());
  print(patterns[sel.value()]);
}

function mouseClicked() {
  
  let mx = mouseX, my = mouseY;
  //avoid the buttons area if pressed
  let pad = Cell.size/2;
  if ( !(mx>=btn_x-pad && my>=btn_y-pad && mx<=btn_endX+pad && my<=btn_endY+pad) ){
    world.drawGrid(mx,my);
  }
}

function createWorld() {
  world = new Grid(rows, cols);
  setButtons();
}

function resetWorld() {
  console.log("Resetting world");
  world.resetGrid();
}

function startLife(){
  console.log("Starting Game of Life");
  world.drawGrid(null,null,start=true);
}

function setButtons(){
  if (deviceType() == 'desktop'){
    btn_x = screen.width/2-200;
    btn_y = 30;
  }
  else{
    btn_x = 15;
    btn_y = 30;
  }

  let x=btn_x,y=btn_y;

  sel = createSelect(false);
  patterns = ['Manual','Glider','Blinker','R-Pentomino','10-Cell Growth'];
  for (let p=0; p<patterns.length; p++){
    sel.option(patterns[p], p);
  }
  sel.selected(patterns[0]);
  sel.position(x, y);
  sel.size(80,30);
  sel.style('border-radius: 5');

  x+=100;
  reset_button = createButton('RESET');
  reset_button.position(x, y);
  reset_button.size(60,30);
  reset_button.style('border-radius: 5');

  start_button = createButton('START');
  x+=80;
  start_button.position(x, y);
  start_button.size(60,30);
  start_button.style('border-radius: 5');
  
  speed_slider = createSlider(1,30,fr,0);
  x+=80;
  speed_slider.position(x, y);
  speed_slider.size(100,30);
  speed_slider.style('border-radius: 5');

  btn_endX = x+100;
  btn_endY = y+30;
}

function deviceType(){
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
  }
  else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "mobile";
  }
  return "desktop";
}

function windowResized() {
  window.scroll(screen.width/2-220, 0);
}