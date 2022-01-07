/** @class Grid class representing the whole grid. */
class Grid {

  /**
   * Creates a new Grid World
   * @constructor 
   * @param {number} rows - amount of rows in the grid
   * @param {number} cols - amount of columns in the grid
   */
  constructor(rows, cols) {

    this.cols = cols;
    this.rows = rows;
    this.drawing_cols = Math.ceil(screen.width/Cell.size);
    this.drawing_rows = Math.ceil(screen.height/Cell.size);

    this.grid = new Array(this.rows);
    this.life = false;

    //pattern of the currently selected
    //option from the dropdown menu
    //By default it's manual
    //meaning only change the clicked cell
    this.current_pattern = {
        "name": "Manual",
        "pattern": [
            [0,0]
        ]
    };

    //this.x is -Cell.size because 
    //won't be printing the first padding
    //so that should be offscreen
    this.x = 0, this.y = 0;
    this.end_x = 0, this.end_y = 0;

    for (let row = 0, drawing_row = 0; row < this.rows; row++) {

      this.grid[row] = new Array(this.cols);

      for (let col = 0, drawing_col = 0; col < this.cols; col++) {

        if(row<this.drawing_rows && col<this.drawing_cols){
          let X = Cell.size * drawing_col + this.x;
          let Y = Cell.size * drawing_row + this.y;
          this.grid[row][col] = new Cell(X, Y, row, col);
          this.grid[row][col].drawCell();
          drawing_col+=1;
        }
        else{
          this.grid[row][col] = new Cell(null, null, row, col);
        }

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
      if(row<=this.drawing_rows){
        drawing_row+=1;
      }
    }

    this.end_x = this.x + Cell.size * this.drawing_cols;
    this.end_y = this.y + Cell.size * this.drawing_rows;
  }

  drawPattern(r,c){
    let grid = this.grid;

    if (this.current_pattern['name'] == 'Manual'){
      grid[r][c].switchColor();
    }
    else{
      for (let p in this.current_pattern['pattern']){
        //gotta write this line due to shitty json format
        //converts every single thing into dictionary -_-
        p = this.current_pattern['pattern'][p];
        //just checking whether the cell is out of
        //the grid boundary or not
        if ((r+p[0])>=0 && (r+p[0])<this.rows && (c+p[1])>=0 && (c+p[1])<this.cols){
          print('dafaq');
          print(r+p[0],c+p[1]);
          grid[r+p[0]][c+p[1]].birthAndDrawCell();
          print("Done");
        }
      }
    }
    // print("=======================");
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
    for (let r=0; r<this.rows; r++) {
      for (let c=0; c<this.cols; c++) {
        let cell = this.grid[r][c];

        if(cell.col_pos<this.drawing_cols && cell.row_pos<this.drawing_rows){
          if (mx && my && cell.mouseHover(mx, my)) {
            print(cell.row_pos+"  "+cell.col_pos);
            this.drawPattern(cell.row_pos,cell.col_pos);
          }
        }
        
        if(r>=2 && c>=2){
          let tmp_cell = this.grid[r-1][c-1];
          tmp_cell.calcAliveNeighbors();
        }
        
        //Checking whether at least a
        //single cell is alive or not
        if(cell.alive){
          all_cell_dead=false;
        }

      }
    }

    //IF LIFE
    if (this.life && !mx && !my){
      for (let r=0; r<this.rows; r++) {
        for (let c=0; c<this.cols; c++) {
          let cell = this.grid[r][c];
          cell.applyRulesOfLife( (c<this.drawing_cols && r<this.drawing_rows) );
        }
      }
    }

    //If game is on but all cell is dead
    if(this.life && all_cell_dead){
      print("Ending the simulation since all cells are dead!")
      this.life = false;
    }

  }

  reDrawGrid(){
    background(0);
    fill(0);
    rect(0,0,screen.width,screen.height);
    for (let r=0; r<this.drawing_rows; r++) {
      for (let c=0; c<this.drawing_cols; c++) {
        let X = Cell.size * c;
        let Y = Cell.size * r;
        this.grid[r][c].setCellPos(X,Y);
        this.grid[r][c].drawCell();
      }
    }
  }

  resetGrid(){
    this.life=false;
    for (let r=0; r<this.rows; r++) {
      for (let c=0; c<this.cols; c++) {
        let cell = this.grid[r][c];

        if (cell.alive && r<this.drawing_rows && c<this.drawing_cols){
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