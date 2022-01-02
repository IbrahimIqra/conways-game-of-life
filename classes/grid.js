/** @class Grid class representing the whole grid. */
class Grid {

  /**
   * Creates a new Grid World
   * @constructor 
   * @param {number} rows - amount of rows in the grid
   * @param {number} cols - amount of columns in the grid
   */
  constructor(rows, cols) {
    //kinda like extra padding
    //we'll ignore this padding
    //when drawing
    rows+=2;
    cols+=2;

    this.rows = rows;
    this.cols = cols;
    this.grid = new Array(rows);
    this.life = false;

    //it keeps track of the currently selected
    //pattern from the dropdown menu
    //By default it's manual
    this.current_pattern = 0;

    //this.x is -Cell.size because 
    //won't be printing the first padding
    //so that should be offscreen
    this.x = -Cell.size, this.y = -Cell.size;
    this.end_x = 0, this.end_y = 0;

    for (let row = 0; row < rows; row++) {

      this.grid[row] = new Array(cols);

      for (let col = 0; col < cols; col++) {
        let X = Cell.size * col + this.x;
        let Y = Cell.size * row + this.y;
        
        this.grid[row][col] = new Cell(X, Y, row, col);

        if(row>=2 && col>=2){
          let tmp_cell = this.grid[row-1][col-1];
          tmp_cell.neighbors.push(this.grid[row-2][col-2]);//up_left
          tmp_cell.neighbors.push(this.grid[row-2][col-1]);//up
          tmp_cell.neighbors.push(this.grid[row-2][col]);//up_right
          tmp_cell.neighbors.push(this.grid[row-1][col-2]);//left
          tmp_cell.neighbors.push(this.grid[row-1][col]);//right
          tmp_cell.neighbors.push(this.grid[row][col-2]);//down_left
          tmp_cell.neighbors.push(this.grid[row][col-1]);//down
          tmp_cell.neighbors.push(this.grid[row][col]);//down_right
        }
      }
    }

    this.end_x = this.x + Cell.size * cols;
    this.end_y = this.y + Cell.size * rows;

  }
  
  drawPattern(r,c){
    let grid = this.grid;

    switch (this.current_pattern) {
      case 0:
        grid[r][c].switchColor();
        break;
      case 1:
        //Glider
        grid[r][c-1].birthAndDrawCell();
        
        grid[r][c].birthAndDrawCell();
        grid[r][c+1].birthAndDrawCell();
        grid[r-1][c+1].birthAndDrawCell();
        grid[r-2][c-2].birthAndDrawCell();
        break;
      case 2:
        //Blinker
        grid[r-1][c].birthAndDrawCell();
        grid[r][c].birthAndDrawCell();
        grid[r+1][c].birthAndDrawCell();
        break;
      case 3:
        //R-Pentomino
        grid[r-1][c].birthAndDrawCell();
        grid[r][c].birthAndDrawCell();
        grid[r+1][c].birthAndDrawCell();
        grid[r][c-1].birthAndDrawCell();
        grid[r-1][c+1].birthAndDrawCell();
        break;
      case 4:
        //10-Cell Growth
        // r-=100;
        // c+=80;

        grid[r][c].birthAndDrawCell();

        grid[r][c+2].birthAndDrawCell();
        grid[r-1][c+2].birthAndDrawCell();

        grid[r-2][c+4].birthAndDrawCell();
        grid[r-3][c+4].birthAndDrawCell();
        grid[r-4][c+4].birthAndDrawCell();

        grid[r-3][c+6].birthAndDrawCell();
        grid[r-4][c+6].birthAndDrawCell();
        grid[r-4][c+7].birthAndDrawCell();
        grid[r-5][c+6].birthAndDrawCell();

        break;
    }

    this.allNeighborCalc();
  }

  //TEMPORARY ALL NEIGHBOR CALC
  allNeighborCalc(){
    for (let r=2; r<this.rows-1; r++) {
      for (let c=2; c<this.cols-1; c++) {
        let cell = this.grid[r-1][c-1];
        cell.calcAliveNeighbors();
      }
    }
  }

  drawGrid(mx=null,my=null,start=false) {

    if (start){
      this.life = true;
    }

    let all_cell_dead = true;
    for (let r=1; r<this.rows-1; r++) {
      for (let c=1; c<this.cols-1; c++) {
        let cell = this.grid[r][c];

        // if (!this.life && mx && my && cell.mouseHover(mx, my)) {
        if (mx && my && cell.mouseHover(mx, my)) {
          print(cell.row_pos+"  "+cell.col_pos);
          this.drawPattern(cell.row_pos,cell.col_pos);
        }
        
        //IF LIFE
        if (this.life && !mx && !my){
          cell.applyRulesOfLife();
          if(r>=2 && c>=2){
            let tmp_cell = this.grid[r-1][c-1];
            tmp_cell.calcAliveNeighbors();
          }
        }

        //Checking whether at least a
        //single cell is alive or not
        if(cell.alive){
          all_cell_dead=false;
        }

      }
    }

    //If game is on but all cell is dead
    if(this.life && all_cell_dead){
      print("Ending the simulation since all cells are dead!")
      this.life = false;
    }

  }

  resetGrid(){
    this.life=false;
    for (let r=1; r<this.rows-1; r++) {
      for (let c=1; c<this.cols-1; c++) {
        let cell = this.grid[r][c];

        if(cell.alive){
          cell.killAndDrawCell();
        }
        else{
          cell.killCell();
        }

        cell.alive_neighbors=0;
      }
    }
  }

}