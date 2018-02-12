// stack properties and coordinates
const stack_height = 250,
      stack_width = 150,
      stack_cx = 300,
      stack_cy = 250,
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
// data elment properties and coordinates
      red_data_fill = "rgb(249, 109, 109)",
      red_data_stroke = "rgb(159, 70, 70)",
      data_stroke_width = 5,
      data_round_value = 15,
      data_width = 130,
      data_height = 50,
      data_init_cx = 110,
      data_init_cy = stack_cy - (stack_height-stack_cover_height)/2;

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
// a data in the stack
var data = draw.rect(data_width, data_height).fill({color : red_data_fill})
      .stroke({color : red_data_stroke, width : data_stroke_width})
      .attr({rx : data_round_value, ry : data_round_value})
      .cx(data_init_cx).cy(data_init_cy);
// drawing the porabola as a path
function draw_parabola(push_or_pop) {
  var c_x1, c_x2, c_y1, c_y2, c_end_x, c_end_y;
  if (push_or_pop == "push") {
    // setting parameters for push porabola
    c_x1 = (stack_rect.x() + data.cx()) / 2;
    c_y1 = 10;
    c_x2 = stack_rect.cx() + (stack_rect.cx() - data.cx())/10;
    c_y2 = 0; //- (stack_rect.cx() - data.cx())/4;
    c_end_x = stack_rect.cx();
    c_end_y = stack_rect.y() + stack_rect.height() - data.height()/2 - data_stroke_width/2 - stack_stroke_width/2;
  } else {
    // TODO: add pop porabola
    // c_x1 =
  }
  return draw.path(`M ${data.cx()} ${data.cy()}
             C ${c_x1} ${c_y1}, ${c_x2} ${c_y2}, ${c_end_x} ${c_end_y} `)
             // enable this line below to see the path
             .stroke({color: "rgb(149, 149, 149)", width: 3})
             .fill({color: "none"});
}
// M startx starty  C (curve) x1 y1, x2 y2, endx endy
var data_porabola = draw_parabola("push");
var data_porabola_length = data_porabola.length();


// connect to button push
var push_button = document.getElementById("push");
push_button.onclick = ()=> {
  // animation of data element pushed into stack
    data.animate({duration: 1000, ease: 'quadInOut'})
      .duringAll((pos, morph, eased) => {
        let c = data_porabola.pointAt(eased * data_porabola_length);
        data.center(c.x, c.y);
        data.style(`transform: rotate(${eased * 360}deg); transform-origin: ${data.cx()}px ${data.cy()}px;`);
      })
      // clearing the push porabola after the animation
      .after(()=> {data_porabola.stroke({color: "none"})})
}



// TODO: add a stack list of data elements, push multiple ones in
