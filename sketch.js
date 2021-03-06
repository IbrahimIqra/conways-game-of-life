let rows, cols,
  lowest_cell_size,
  patterns_json,
  sel,reset_button,start_button,speed_slider,
  zoom_in_button,zoom_out_button,
  btn_x,btn_y,btn_endX,btn_endY,
  world,
  fr=9;

function preload(){
  patterns_json = loadJSON('patterns.json');
}

function setup() {

  createCanvas(screen.width,screen.height);
  background(0);

  createWorld();

  if (deviceType()=='desktop'){
    alert('Press F11 for fullscreen');
  }
}

function draw() {

  //enabling the zoom_in and zoom_out buttons
  //when execution reached the draw() after
  //completing Zooming In/Out operation
  zoom_in_button.removeAttribute('disabled');
  zoom_out_button.removeAttribute('disabled');

  if(world.life){
    reset_button.html("KILL ALL");
    //enabling the reset button when simulation is running
    reset_button.removeAttribute('disabled');
    fr = speed_slider.value();
    frameRate(fr);
    world.drawGrid();
  }
  else{
    frameRate(30);
  }

}

function patternUpdated(){
  world.current_pattern = patterns_json[sel.value()];
  print(patterns_json[sel.value()]['name']);
}

function mouseClicked() {
  
  let mx = mouseX, my = mouseY;
  //avoid the buttons area if pressed
  let pad = Cell.size/2;
  if ( !(mx>=btn_x-pad && my>=btn_y-pad && mx<=btn_endX+pad && my<=btn_endY+pad) ){
    //enabling the reset button when drawing pattern
    reset_button.removeAttribute('disabled');
    world.drawGrid(mx,my);
  }
}

function createWorld() {
  world = new Grid();
  print(world.rows,world.cols);
  setButtons();
}

function resetWorld() {
  //alive to dead
  if (world.life){
    console.log("Resetting world");
    world.resetGrid();
    reset_button.html("CLEAR");
  }
  //if the world is already dead
  else{
    console.log("Clearing the residue of the previous world");
    console.log("Creating a brand new world");
    world = new Grid(rows,cols);
    patternUpdated();
    reset_button.html("RESET");
    //disabling the button because just resetted
    reset_button.attribute('disabled', '');
  }
}

function startLife(){
  console.log("Starting Game of Life");
  world.drawGrid(null,null,start=true);
}

function zoomInClicked(){
  //disabling the button to prevent spamming
  zoom_in_button.attribute('disabled', '');
  world.zoomIn(zoom_in_button);
  //enabling it again in the draw()
}

function zoomOutClicked(){
  //disabling the button to prevent spamming
  zoom_out_button.attribute('disabled', '');
  print("Drawing zoomed out grid");
  world.zoomOut(zoom_out_button);
  print("Done!");
  //enabling it again in the draw()
}

function setButtons(){
  if (deviceType() == 'desktop'){
    btn_x = screen.width/2-100;
    btn_y = 30;
  }
  else{
    btn_x = 20;
    btn_y = 30;
  }

  let x=btn_x,y=btn_y;

  sel = createSelect(false);

  for (let sl in patterns_json){
    sel.option(patterns_json[sl]['name'], int(sl));
  }
  sel.selected("Manual");
  sel.position(x, y);
  sel.size(80,30);
  sel.style('border-radius: 5');

  zoom_in_button = createButton('ZOOM IN');
  zoom_in_button.position(x+10, y+40);
  zoom_in_button.size(100,25);
  zoom_in_button.style('border-radius: 5');

  speed_slider = createSlider(1,30,fr,0);
  speed_slider.position(x+15, y+70);
  speed_slider.size(200,30);
  speed_slider.style('border-radius: 5');

  x+=100;
  reset_button = createButton('RESET');
  reset_button.position(x, y);
  reset_button.size(60,30);
  reset_button.style('border-radius: 5');

  zoom_out_button = createButton('ZOOM OUT');
  zoom_out_button.position(x+30, y+40);
  zoom_out_button.size(100,25);
  zoom_out_button.style('border-radius: 5');

  start_button = createButton('START');
  x+=80;
  start_button.position(x, y);
  start_button.size(60,30);
  start_button.style('border-radius: 5');

  btn_endX = x+80;
  btn_endY = y+30+70;

  //Now select setting button events
  reset_button.mouseClicked(resetWorld);
  start_button.mouseClicked(startLife);
  sel.changed(patternUpdated);
  zoom_in_button.mouseClicked(zoomInClicked);
  zoom_out_button.mouseClicked(zoomOutClicked);
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