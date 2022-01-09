/** @class Grid class representing the whole grid. */
class Grid {

  /**
   * Creates a new Grid World
   * @constructor 
   * @param {number} rows - amount of rows in the grid
   * @param {number} cols - amount of columns in the grid
   */

  constructor() {

    let screen_res = screen.width*screen.height;
    this.max_cell_amount = 230400;
    this.lowest_cell_size = Math.sqrt(screen_res/this.max_cell_amount);
    
    this.cols = Math.ceil(screen.width/this.lowest_cell_size);
    this.rows = Math.ceil(screen.height/this.lowest_cell_size);

    this.defineDrawingLen();

    this.grid = new Array(this.rows);
    this.life = false;

    //pattern of the currently selected
    //option from the dropdown menu
    //By default it's manual
    this.current_pattern = {
        "name": "Manual",
        "pattern": [
            [0,0]
        ]
    };

    this.x = 0, this.y = 0;
    this.end_x = 0, this.end_y = 0;

    for (let row = 0, drawing_row = 0; row < this.rows; row++) {

      this.grid[row] = new Array(this.cols);

      for (let col = 0, drawing_col = 0; col < this.cols; col++) {

        if (this.withinDrawingBoundary(row,col)){
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
      if (row>=this.drawing_start_row && row<this.drawing_end_row){
        drawing_row+=1;
      }
    }

    this.end_x = this.x + Cell.size * this.total_drawing_cols;
    this.end_y = this.y + Cell.size * this.total_drawing_rows;

  }

  //returns true if r,c is within the drawing boundary
  withinDrawingBoundary(r,c){
    return (
      r>=this.drawing_start_row && 
      r<this.drawing_end_row &&
      c>=this.drawing_start_col &&
      c<this.drawing_end_col);
  }
  
  //returns true if r,c is within the world boundary
  withinWorldBoundary(r,c){
    return (
      r>=0 && 
      r<this.rows &&
      c>=0 &&
      c<this.cols);
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
        if ( this.withinWorldBoundary( r+p[0] , c+p[1] ) ){
          grid[r+p[0]][c+p[1]].birthAndDrawCell();
        }
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

        if ( this.withinDrawingBoundary(cell.row_pos,cell.col_pos) ){
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
          cell.applyRulesOfLife( this.withinDrawingBoundary(r,c) );
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
    for (let r=0, r_count=0; r<this.rows; r++) {
      for (let c=0, c_count=0; c<this.cols; c++) {
        if ( this.withinDrawingBoundary(r,c) ){
          let X = Cell.size * c_count;
          let Y = Cell.size * r_count;
          this.grid[r][c].setCellPos(X,Y);
          this.grid[r][c].drawCell();
          c_count++;
        }
        else{
          this.grid[r][c].setCellPos(null,null);
        }
      }
      if ( r>=this.drawing_start_row && r<this.drawing_end_row){
        r_count++;
      }
    }
  }

  resetGrid(){
    this.life=false;
    for (let r=0; r<this.rows; r++) {
      for (let c=0; c<this.cols; c++) {
        let cell = this.grid[r][c];

        if (cell.alive && this.withinDrawingBoundary(r,c)){
          cell.killAndDrawCell();
        }
        else{
          cell.killCell();
        }

        cell.alive_neighbors=0;
      }
    }
  }

  zoomIn(){
    Cell.size+=1;
    if(Cell.size>30){
      Cell.size-=1;
      alert('Max Zoom In Limit Reached');
    }
    else{
      this.defineDrawingLen();
      this.reDrawGrid();
    }
  }

  zoomOut(){
    Cell.size-=1;
    if(Cell.size<this.lowest_cell_size){
      Cell.size+=1;
      alert('Max Zoom Out Limit Reached');
    }
    else{
      this.defineDrawingLen();
      this.reDrawGrid();
    }
  }

  defineDrawingLen(){
    this.total_drawing_rows = Math.ceil(screen.height/Cell.size);
    this.total_drawing_cols = Math.ceil(screen.width/Cell.size);

    this.drawing_start_row = 0;
    this.drawing_end_row = this.rows;
    this.drawing_start_col = 0;
    this.drawing_end_col = this.cols;

    while (true){

      if ( this.drawing_end_row-this.drawing_start_row<=this.total_drawing_rows &&
        this.drawing_end_col-this.drawing_start_col<=this.total_drawing_cols ){
          break;
        }
      if (this.drawing_end_row-this.drawing_start_row > this.total_drawing_rows){
        this.drawing_start_row+=1;
      }
      if (this.drawing_end_row-this.drawing_start_row > this.total_drawing_rows){
        this.drawing_end_row-=1;
      }
      if (this.drawing_end_col-this.drawing_start_col > this.total_drawing_cols){
        this.drawing_start_col+=1;
      }
      if (this.drawing_end_col-this.drawing_start_col > this.total_drawing_cols){
        this.drawing_end_col-=1;
      }

    }
  }

}