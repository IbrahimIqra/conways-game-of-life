/** @class Cell class representing a cell. */
class Cell {
  /**
   * Cell takes 3 arguments x , y, size
   * and creates a cell of given size
   * at x,y position
   * @param {number} x - x position
   * @param {number} y - y position
   */
  static size = 5;

  constructor(x, y, row_pos, col_pos) {
    this.x = x;
    this.y = y;
    this.row_pos = row_pos;
    this.col_pos = col_pos;
    this.end_x = x + Cell.size;
    this.end_y = y + Cell.size;

    //DEAD=BLACK=(RGB_val=0)
    //ALIVE=WHITE=(RGB_val=255)
    this.color = 0;
    this.alive = false;
    this.alive_neighbors = 0;
    //all neighbors
    this.neighbors = [];

    this.drawCell();
  }

  drawCell() {
    fill(this.color);
    stroke(5);
    strokeWeight(0.2);
    rect(this.x, this.y, Cell.size);
  }

  killCell(){
    this.color=0;
    this.alive=false;
  }

  killAndDrawCell(){
    this.color=0;
    this.alive=false;
    this.drawCell();
  }

  birthCell(){
    this.color=255;
    this.alive=true;
  }

  birthAndDrawCell(){
    this.color=255;
    this.alive=true;
    this.drawCell();
  }

  /**
   * returns true if mouse is pressed while within the cell otherwise return false
   * @param {number} mx - x position of the Mouse
   * @param {number} my - y position of the Mouse
   * @returns {boolean}
   */
  mouseHover(mx, my) {
    this.end_x = this.x + Cell.size;
    this.end_y = this.y + Cell.size;

    return mx > this.x && mx < this.end_x && my > this.y && my < this.end_y;
  }

  /**
   * changes the color of the cell
   */
  switchColor() {
    if(this.alive){
      this.killAndDrawCell();
    }
    else{
      this.birthAndDrawCell();
    }
  }

  applyRulesOfLife() {

    //IF CELL ALIVE WITH BLACK COLOR (255)
    if (this.alive) {
      if (this.alive_neighbors != 2 && this.alive_neighbors != 3) {
        //OVERPOPULATION KILL THE CELL
        this.killAndDrawCell();
      }
    }
    //ELSE: IF CELL DEAD WITH WHITE COLOR (0)
    else {
      if (this.alive_neighbors == 3) {
        // if exactly 3 neighbors alive
        // then this cell is born
        this.birthAndDrawCell();
      }
    }
    
  }

  calcAliveNeighbors(){
    this.alive_neighbors=0;
    for(let n of this.neighbors){
      if(n.alive){
        this.alive_neighbors+=1;
      }
    }
  }
}