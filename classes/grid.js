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
  
  drawPattern(p){
    let grid = this.grid;
    let x = Math.floor(rows/2);
    let y = Math.floor(cols/2);
    
    print('inside draw pattern ',p);

    switch (int(p)) {
      case 0:
        //Glider
        break;
      case 1:
        //Blinker
        grid[x-1][y].color = 0;
        grid[x-1][y].alive = true;

        grid[x][y].color = 0;
        grid[x][y].alive = true;

        grid[x+1][y].color = 0;
        grid[x+1][y].alive = true;
        break;
      case 2:
        //R-Pentomino
        print('inside case statement');
        grid[x-1][y].color = 0;
        grid[x-1][y].alive = true;

        grid[x][y].color = 0;
        grid[x][y].alive = true;

        grid[x+1][y].color = 0;
        grid[x+1][y].alive = true;

        grid[x][y-1].color = 0;
        grid[x][y-1].alive = true;

        grid[x-1][y+1].color = 0;
        grid[x-1][y+1].alive = true;
        print(x,y,' Color Changed');
        break;
      case 3:
        //10-Cell Growth
        x-=10;

        grid[x][y].color = 0;
        grid[x][y].alive = true;

        grid[x+2][y].color = 0;
        grid[x+2][y].alive = true;
        grid[x+2][y+1].color = 0;
        grid[x+2][y+1].alive = true;

        grid[x+4][y+2].color = 0;
        grid[x+4][y+2].alive = true;
        grid[x+4][y+3].color = 0;
        grid[x+4][y+3].alive = true;
        grid[x+4][y+4].color = 0;
        grid[x+4][y+4].alive = true;

        grid[x+6][y+3].color = 0;
        grid[x+6][y+3].alive = true;
        grid[x+6][y+4].color = 0;
        grid[x+6][y+4].alive = true;
        grid[x+7][y+4].color = 0;
        grid[x+7][y+4].alive = true;
        grid[x+6][y+5].color = 0;
        grid[x+6][y+5].alive = true;

        break;
    }

    //for now
    this.drawGrid();
  }

  drawGrid(mx=null,my=null,reset=false,start=false) {

    if (start){
      this.life = true;
    }
    if (reset){
      this.life = false;
    }

    let all_cell_dead = true;
    for (let r=1; r<this.rows-1; r++) {
      for (let c=1; c<this.cols-1; c++) {
        let cell = this.grid[r][c];

        //allow changing cell state by clicking only
        //when life hasn't begun or the grid isn't resetting
        if (!reset && !start && mx && my && cell.mouseHover(mx, my)) {
          print(cell.row_pos+"  "+cell.col_pos);
          cell.changeColor();
        }

        //IF LIFE
        if (this.life){
          cell.applyRulesOfLife();
        }

        //Checking whether at least a
        //single cell is alive or not
        if(cell.color==0){
          all_cell_dead=false;
        }
        
        if (reset){
          cell.color = 255;
          cell.alive = false;
        }

        cell.drawCell();

        //No need to calculate neighbor
        //if reset is pressed
        if(!reset && r>=2 && c>=2){
          let tmp_cell = this.grid[r-1][c-1];
          tmp_cell.calcAliveNeighbors();
        }

      }
    }
    
    //If game is on but all cell is dead
    if(this.life && all_cell_dead){
      return -1;
    }

  }

}