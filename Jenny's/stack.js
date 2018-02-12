const stack_height = 250;
const stack_width = 150;
const stack_cx = 300;
const stack_cy = 250;
const stack_frame_color = "rgb(51, 51, 51)";
const stack_fill_color = "rgb(255, 255, 255)";
const stack_stroke_width = 5;
const stack_round_value = 15;
const stack_cover_height = 30;

const LEFT_COORD = stack_cx - stack_width / 2;
const RIGHT_COORD = stack_cx + stack_width / 2;
const BOTTOM_COORD = stack_cy + stack_height / 2;
const UP_COORD = stack_cy - stack_height / 2;

const red_data_fill = "rgb(249, 109, 109)";
const red_data_stroke = "rgb(159, 70, 70)";
const data_stroke_width = 5;
const data_round_value = 15;
const data_width = 130;
const data_height = 50;
const data_init_cx = 110;
const data_init_cy = stack_cy - (stack_height-stack_cover_height)/2;

var draw = SVG('drawing').size(500, 500);
// stack frame and cover
var stack_rect = draw.rect(stack_width, stack_height)
    .fill({color: stack_fill_color})
    .stroke({color : stack_frame_color, width: stack_stroke_width})
    .attr({rx: stack_round_value, ry: stack_round_value} )
    .cx(stack_cx).cy(stack_cy);
var stack_top_cover = draw.rect(stack_width, stack_cover_height)
    .fill({color: stack_fill_color})
    .stroke({color: stack_fill_color, width: stack_stroke_width})
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

var c_x1 = (stack_rect.x() + data.cx()) / 2;
var c_y1 = 0;
var c_x2 = stack_rect.cx() + (stack_rect.cx() - data.cx())/10;
var c_y2 = - (stack_rect.cx() - data.cx())/4;
var c_end_y = stack_rect.y() + stack_rect.height() - data.height()/2 - data_stroke_width/2 - stack_stroke_width/2;
var data_porabola = draw.path(`M ${data.cx()} ${data.cy()}
           C ${c_x1} ${c_y1}, ${c_x2} ${c_y2}, ${stack_rect.cx()} ${c_end_y} `)
    .stroke({color: "rgb(149, 149, 149)", width: 3})
    .fill({color: "none"})
var data_porabola_length = data_porabola.length();


// test line path
// var line_path = draw.path(`M ${data.cx()} ${data.cy()} L 300 300`).stroke({color: "grey"})

var push_button = document.getElementById("push");
push_button.onclick = ()=> {
  data.animate({duration: 1000, ease: 'quadInOut'})
      .duringAll((pos, morph, eased) => {
        // let c = line_path.pointAt(eased * line_path.length());
        let c = data_porabola.pointAt(eased * data_porabola_length);
        data.center(c.x, c.y);
        data.rotate(eased * 180);
      })
    }
