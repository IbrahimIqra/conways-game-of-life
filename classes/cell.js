/** @class Cell class representing a cell. */
class Cell {
  /**
   * Cell takes 3 arguments x , y, size
   * and creates a cell of given size
   * at x,y position
   * @param {number} x - x position
   * @param {number} y - y position
   */
  static size = 20;

  constructor(x, y, row_pos, col_pos) {
    this.x = x;
    this.y = y;
    if(x!=null && y!=null){
      this.end_x = x + Cell.size;
      this.end_y = y + Cell.size;
    }

    this.row_pos = row_pos;
    this.col_pos = col_pos;
    
    //DEAD=BLACK=(RGB_val=0)
    //ALIVE=WHITE=(RGB_val=255)
    this.color = 0;
    this.alive = false;
    this.alive_neighbors = 0;
    //all neighbors
    this.neighbors = [];
  }

  setCellPos(x, y) {
    if (x!=null && y!=null){
      this.x = x;
      this.y = y;
      this.end_x = x + Cell.size;
      this.end_y = y + Cell.size;
    }
    else{
      this.x = null;
      this.y = null;
      this.end_x = null;
      this.end_y = null;
    }
  }

  drawCell() {
    //Only draw if the position has been declared
    if (this.x!=null && this.y!=null){
      fill(this.color);
      stroke(50);
      strokeWeight(0.5);
      rect(this.x, this.y, Cell.size);
    }
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

  applyRulesOfLife(within_limit=true) {

    //IF CELL ALIVE WITH WHITE COLOR (255)
    if (this.alive) {
      if (this.alive_neighbors != 2 && this.alive_neighbors != 3) {
        //OVERPOPULATION KILL THE CELL
        if (within_limit){
          this.killAndDrawCell();
        }
        else{
          this.killCell();
        }
      }
    }
    //ELSE: IF CELL DEAD WITH BLACK COLOR (0)
    else {
      if (this.alive_neighbors == 3) {
        // if exactly 3 neighbors alive
        // then this cell is born
        if (within_limit){
          this.birthAndDrawCell();
        }
        else{
          this.birthCell();
        }
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