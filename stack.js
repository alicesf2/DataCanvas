// stack properties and coordinates
const stack_height = 250,
      stack_width = 150,
      stack_cx = 250,
      stack_cy = 250,
      stack_frame_color = "rgb(87, 43, 15)",
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
      output_cx = 500,
      output_cy = BOTTOM_COORD - output_height/2,
      output_stroke_color = "rgb(34, 56, 88)",
      output_stroke_width = 5,
      output_fill_color = "rgb(255, 255, 255)",
// labels for stack and output
      label_font = "comic sans ms",
      label_size = 30,
// data element properties and coordinates
      red_data_fill = "rgb(249, 109, 109)",
      red_data_stroke = "rgb(159, 70, 70)",
      data_stroke_width = 5,
      data_round_value = 15,
      data_width = 130,
      data_height = 50,
      data_init_cx = 75,
      data_init_cy = stack_cy - (stack_height-stack_cover_height)/4,
// the data name parameters
      red_data_name_color = "rgb(255, 228, 221)",
      data_name_size = 25;
      data_name_font = "palatino";
// gap between each data
      data_stack_gap = 2;
// max data number
      max_num_data = 5;

var draw, stack_rect, stack_top_cover, stack_label, stack_group,
    output, output_frame, output_cover, output_label, static_bg;

draw = SVG('stackAnimation').size(0,0);

function drawStack() {

  // the canvas
   draw.size(700, 500);

  // the stack group
  stack_group = draw.group();
  // stack frame and cover
  stack_rect = stack_group.rect(stack_width, stack_height)
        .fill({color: stack_fill_color})
        .stroke({color : stack_frame_color, width: stack_stroke_width})
        .attr({rx: stack_round_value, ry: stack_round_value} )
        .cx(stack_cx).cy(stack_cy);
  stack_top_cover = stack_group.rect(stack_width, stack_cover_height)
        .fill({color: stack_fill_color})
        .stroke({color: stack_fill_color, width: stack_stroke_width + 2})
        .x(stack_rect.x()).y(stack_rect.y());
  stack_label = stack_group.plain("Stack")
        .font({family: label_font, fill: stack_frame_color, size: label_size})
        .cx(stack_cx).y(BOTTOM_COORD);

  // group the output bowl
   output = draw.group();
  // output bowl
   output_frame = output.ellipse(output_width, output_height)
        .center(output_cx, output_cy).fill({color: output_fill_color})
        .stroke({color: output_stroke_color, width: output_stroke_width});
   output_cover = output.rect(output_width - 20, output_height/2).fill({color: output_fill_color})
        .center(output_frame.cx(), output_frame.cy() - output_height/3);
   output_label = output.plain("Output")
        .font({family: label_font, fill: output_stroke_color, size: label_size})
        .cx(output_cx).y(BOTTOM_COORD);


  // group everything on the background (the stack and the output)
   static_bg = draw.group();
  static_bg.add(stack_group);
  static_bg.add(output);
  // put the background on the back
  static_bg.back()
}
  // the y value of top of all the data stacked together
  var stack_upon_y;

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
      c_end_y = stack_upon_y;
    } else {
      // add pop parabola
      c_x1 = stack_rect.cx();
      c_y1 = 0;
      c_x2 = output_cx;
      c_y2 = 0;
      c_end_x = output_cx;
      c_end_y = output_cy + 33;
    }

    // path: M startx starty  C (curve) x1 y1, x2 y2, endx endy
    return draw.path(`M ${data.cx()} ${data.cy()}
               C ${c_x1} ${c_y1}, ${c_x2} ${c_y2}, ${c_end_x} ${c_end_y} `)
               // enable this line below to see the path
               // .stroke({color: "rgb(149, 149, 149)", width: 3})
               .fill({color: "none"});
  }

var animate_property = {duration: 800, ease: 'quadInOut'};

// a data in the stack
class Data {
  constructor(data_name) {
    this.data = draw.rect(data_width, data_height).fill({color : red_data_fill})
          .stroke({color : red_data_stroke, width : data_stroke_width})
          .attr({rx : data_round_value, ry : data_round_value})
          .cx(data_init_cx).cy(data_init_cy);
    this.name = draw.plain(data_name)
          .font({fill: red_data_name_color, family: data_name_font, size: data_name_size});
    this.name.center(data_init_cx - this.name.width()/4, data_init_cy - this.name.height()/3)
    this.group = draw.group();
    this.group.add(this.data);
    this.group.add(this.name);
    }
  // animate the entire data chunk along a parabola
  animate_data(parabola, clear, toFront) {
    let parabola_length = parabola.length()
    this.group.animate(animate_property) // duration: 1500 , ease: 'bounce'
        .during((pos, morph, eased) => {
            let c = parabola.pointAt(eased * parabola_length);
            this.data.center(c.x, c.y);
            this.name.center(c.x, c.y - 1);
            if (toFront && eased > 0.5 && eased < 0.6) {
              this.group.front();
            }
            this.group.style(`transform: rotate(${eased * 360}deg); transform-origin: ${this.data.cx()}px ${this.data.cy()}px;`);
        // if want to clear the data, delay 1s and fade it
      })//.after(()=>{})
    if (clear) {
      this.data.animate(700, "<", 1000).fill({color: "rgb(255, 255, 255)"}).stroke({color: "rgb(255, 255, 255)"});
      this.name.animate(700, "<", 1000).font({fill: "rgb(255, 255, 255)"})
          .after(()=>{
            this.group.remove();
          });
    }
  }
  x() { return this.data.x()}
  y() { return this.data.y()}
  cx() { return this.data.cx()}
  cy() { return this.data.cy()}
  width() {return this.data.width()}
  height() {return this.data.height()}
  clear() {this.group.clear()}
  backward() {this.group.backward();}
}

function clearStack() {
  draw.clear();
  draw.size(0, 0);
  stack_data.length = 0;
}

// a list of stack data
var stack_data = []

// functions that once called, move the data in/out the stack
function push() {
  var data_name = input.value;
  input.value = "";
  var data = new Data(data_name);
  // change the top y value to land
  if (0 < stack_data.length && stack_data.length < max_num_data) {
    stack_upon_y = BOTTOM_COORD - stack_data.length * data_height - data_height/2 - data_stroke_width - data_stack_gap;
  } else if (stack_data.length >= max_num_data) {
    stack_upon_y = BOTTOM_COORD - max_num_data * data_height - (stack_data.length - max_num_data) * 1.01 - data_height/2 - data_stroke_width - data_stack_gap;
  } else {
    stack_upon_y = BOTTOM_COORD - data_height/2 - data_stroke_width/2 - stack_stroke_width/2 - data_stack_gap;
  }

  stack_data.push(data);
  var parabola = draw_parabola("push", data);
  data.animate_data(parabola, false, false);
  parabola.remove();
}

function pop() {
  var data = stack_data.pop();
  if (data != undefined) {
    var parabola = draw_parabola("pop", data);
    data.animate_data(parabola, true, true);
    parabola.remove();
    delete data;
  }
}

function bounce() {
  if (bounce_checkbox.checked) {
    animate_property = {duration: 1500, ease: 'bounce'};
  } else {
    animate_property = {duration: 800, ease: 'quadInOut'};
  }
}



// connect functions to buttons
var push_button = document.getElementById("push"),
    pop_button = document.getElementById("pop"),
    input = document.getElementById("data"),
    bounce_checkbox = document.getElementById("bounce");


push_button.onclick = push;
pop_button.onclick = pop;
bounce_checkbox.onclick = bounce;

// enable pressing enter in the text box to push
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    push_button.click();
  }
})


//
