// stack properties and coordinates
const stack_height = 250,
      stack_width = 150,
      stack_cx = 300,
      stack_cy = 300,
      stack_frame_color = "rgb(51, 51, 51)",
      stack_fill_color = "rgb(255, 255, 255)",
      stack_stroke_width = 5,
      stack_round_value = 15,
      stack_cover_height = 30,
// manipulate stack properties to draw the frame
      LEFT_COORD = stack_cx - stack_width / 2,
      RIGHT_COORD = stack_cx + stack_width / 2,
      BOTTOM_COORD = stack_cy + stack_height / 2,
      UP_COORD = stack_cy - stack_height / 2,
// output bowl parameters
      output_width = 200,
      output_height = 150,
      output_cx = 550,
      output_cy = BOTTOM_COORD - output_height/2,
      output_stroke_color = "rgb(34, 56, 88)",
      output_stroke_width = 5,
      output_fill_color = "rgb(255, 255, 255)",
// data element properties and coordinates
      red_data_fill = "rgb(249, 109, 109)",
      red_data_stroke = "rgb(159, 70, 70)",
      data_stroke_width = 5,
      data_round_value = 15,
      data_width = 130,
      data_height = 50,
      data_init_cx = 110,
      data_init_cy = stack_cy - (stack_height-stack_cover_height)/2,
// the data name parameters
      red_data_name_color = "rgb(255, 228, 221)",
      data_name_size = 25;
      data_name_font = "palatino";



// the canvas
var draw = SVG('drawing').size(1000, 500);


// stack frame and cover
var stack_rect = draw.rect(stack_width, stack_height)
      .fill({color: stack_fill_color})
      .stroke({color : stack_frame_color, width: stack_stroke_width})
      .attr({rx: stack_round_value, ry: stack_round_value} )
      .cx(stack_cx).cy(stack_cy);
var stack_top_cover = draw.rect(stack_width, stack_cover_height)
      .fill({color: stack_fill_color})
      .stroke({color: stack_fill_color, width: stack_stroke_width + 2})
      .x(stack_rect.x()).y(stack_rect.y())
// the entire stack is grouped
var stack = draw.group()
stack.add(stack_rect)
stack.add(stack_top_cover)

// output bowl
var output_frame = draw.ellipse(output_width, output_height)
      .center(output_cx, output_cy).fill({color: output_fill_color})
      .stroke({color: output_stroke_color, width: output_stroke_width});
var output_cover = draw.rect(output_width - 20, output_height/2).fill({color: output_fill_color})
      .center(output_frame.cx(), output_frame.cy() - output_height/3)

// group the output bowl
var output = draw.group()
output.add(output_frame);
output.add(output_cover);

// group everything on the background (the stack and the output)
var static_bg = draw.group();
static_bg.add(stack);
static_bg.add(output);
// put the background on the back
static_bg.back()



// a data in the stack
class Data {
  constructor(data_name) {
    this.data = draw.rect(data_width, data_height).fill({color : red_data_fill})
          .stroke({color : red_data_stroke, width : data_stroke_width})
          .attr({rx : data_round_value, ry : data_round_value})
          .cx(data_init_cx).cy(data_init_cy);
    this.name = draw.plain(data_name)
          .font({fill: red_data_name_color, font: data_name_font, size: data_name_size});
    this.name.center(data_init_cx - this.name.width()/4, data_init_cy)
    this.group = draw.group();
    this.group.add(this.data);
    this.group.add(this.name);
    }
  // animate the entire data chunk along a parabola
  animate_data(parabola) {
    let parabola_length = parabola.length()
    this.group.animate({duration: 1000, ease: 'quadInOut'})
        .duringAll((pos, morph, eased) => {
            let c = parabola.pointAt(eased * parabola_length);
            this.data.center(c.x, c.y);
            this.name.center(c.x, c.y);
            this.group.style(`transform: rotate(${eased * 360}deg); transform-origin: ${this.data.cx()}px ${this.data.cy()}px;`);
    })
  }
  cx() { return this.data.cx()}
  cy() { return this.data.cy()}
  width() {return this.data.width()}
  height() {return this.data.height()}
}


// drawing the parabola as a path
function draw_parabola(push_or_pop, data) {
  var c_x1, c_x2, c_y1, c_y2, c_end_x, c_end_y;
  if (push_or_pop == "push") {
    // setting parameters for push parabola
    c_x1 = (stack_rect.x() + data.cx()) / 2;
    c_y1 = 10;
    c_x2 = stack_rect.cx() + (stack_rect.cx() - data.cx())/10;
    c_y2 = 0; //- (stack_rect.cx() - data.cx())/4;
    c_end_x = stack_rect.cx();
    c_end_y = stack_rect.y() + stack_rect.height() - data.height()/2 - data_stroke_width/2 - stack_stroke_width/2;
  } else {
    // TODO: add pop parabola
    c_x1 = stack_rect.cx();
    c_y1 = 0;
    c_x2 = output_cx;
    c_y2 = 0;
    c_end_x = output_cx;
    c_end_y = output_cy;
  }
  // path: M startx starty  C (curve) x1 y1, x2 y2, endx endy
  return draw.path(`M ${data.cx()} ${data.cy()}
             C ${c_x1} ${c_y1}, ${c_x2} ${c_y2}, ${c_end_x} ${c_end_y} `)
             // enable this line below to see the path
             // .stroke({color: "rgb(149, 149, 149)", width: 3})
             .fill({color: "none"});
}

// connect functions to buttons
var push_button = document.getElementById("push"),
    pop_button = document.getElementById("pop"),
    input = document.getElementById("data")

push_button.onclick = push;
pop_button.onclick = pop;

// a list of stack data
var stack_data = []

// functions that once called, move the data in/out the stack
function push() {
  var data_name = input.value;
  input.value = "";
  var data = new Data(data_name);
  stack_data.push(data);
  move(draw_parabola("push", data), data)
}
function pop() {
  var data = stack_data.pop();
  move(draw_parabola("pop", data), data)
}

// helper function for push() and pop()
function move(parabola, data) {
  data.animate_data(parabola);
}



//
