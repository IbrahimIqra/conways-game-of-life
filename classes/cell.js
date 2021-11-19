/** @class Cell class representing a cell. */
class Cell {
  /**
   * Cell takes 3 arguments x , y, size
   * and creates a cell of given size
   * at x,y position
   * @param {number} x - x position
   * @param {number} y - y position
   */
  static size = 11;

  constructor(x, y, row_pos, col_pos) {
    this.x = x;
    this.y = y;
    this.row_pos = row_pos;
    this.col_pos = col_pos;
    this.end_x = x + Cell.size;
    this.end_y = y + Cell.size;

    this.color = 255;
    this.alive = false;
    this.alive_neighbors = 0;
    //all neighbors
    this.neighbors = [];

  }

  drawCell() {
    fill(this.color);
    stroke(220);
    strokeWeight(0.5);
    rect(this.x, this.y, Cell.size);
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
  changeColor() {
    console.log("COLOR CHANGED FROM", this.color);
    this.color = (this.color == 255) ? 0 : 255;
    console.log("TO", this.color);
    this.alive = (this.color == 0) ? true : false;
  }

  applyRulesOfLife() {

    //IF CELL ALIVE WITH BLACK COLOR (0)
    if (this.alive) {
      if (this.alive_neighbors != 2 && this.alive_neighbors != 3) {
        this.color = 255;
        this.alive = false;
      }
    }
    //ELSE: IF CELL DEAD WITH WHITE COLOR (255)
    else {
      if (this.alive_neighbors == 3) {
        // if exactly 3 neighbors alive
        // then this cell is born
        this.color = 0;
        this.alive = true;
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
