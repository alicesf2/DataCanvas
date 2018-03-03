
//implementation of queue
//fifo
/*
q.enqueue()
q.dequeue()
q.isempty()
*/

//queue structure coords and params
    // left_x = 200;
    // right_x = 1000;
    // upper_y = 100;
    // lower_y = 200;
const q_cx = 400,
    q_cy = 200,
    q_struct_width = 450,
    q_struct_height = 100,
    q_stroke_width = 5,
//bounds
    LEFT = q_cx - q_struct_width / 2,
    RIGHT = q_cx + q_struct_width / 2,
    UPPER = q_cy - q_struct_height / 2,
    LOWER = q_cy + q_struct_height / 2,
// //output bowl params
//     output_height = 2.1 * q_struct_height,
//     output_width = 1.8 * q_struct_height,
//     output_cx = LEFT / 2,
//     output_cy = q_cy,
//data_elem params
    data_elem_width = 90,
    data_elem_height = 90,
    data_l_cx = LEFT - data_elem_width,
    data_l_cy = q_cy,
//labels
    label_font = "comic sans ms",
    label_size = 30,
    elem_label_size = 15,
//colors
    q_frame_color = '#7b2d26',
    q_data_color = '#05a8aa',
    empty = '#FFFFFF',
//numbers
    max_num_data = 7,
    data_queue_gap = 2,
//data name color arr
    name_arr = [q_frame_color];//const?

//name arr index
    var name_arr_idx = 0;

//canvas
var draw = SVG('drawing').size(800, 600)
//queue structure
var upper = draw.line(LEFT, UPPER, RIGHT, UPPER)
    upper.stroke({ color: q_frame_color, width: q_stroke_width, linecap: 'round' });

var lower = draw.line(LEFT, LOWER, RIGHT, LOWER)
    lower.stroke({color: q_frame_color, width: q_stroke_width, linecap: 'round'});
var q_struct_label = draw.plain("Queue")
        .font({family: label_font, fill: q_frame_color, size: label_size})
        .cx(q_cx)
        .cy(LOWER + 20);
//data elem
// var rect_elem = draw.rect(data_elem_width, data_elem_height).fill(q_data_color)
//                     .cx(data_l_cx)
//                     .cy(data_l_cy);
//     rect_elem.radius(10, 20);
//group queue
var queue = draw.group()
    queue.add(upper)
    queue.add(lower)
    queue.add(q_struct_label)
// //group output bowl
// var output = draw.group();
// //output bowl
// var output_frame = output.ellipse(output_width, output_height)
//         .center(output_cx, output_cy).fill({color: empty})
//         .stroke({color:q_frame_color, width: q_stroke_width});
// var output_cover = output.rect(output_width - 20, output_height * 0.75)
//         .fill({color: empty})
//         .cx((output_cx + LEFT) / 2)
//         .cy(q_cy);
// var output_label = output.plain("Output")
//         .font({family: label_font, fill: q_frame_color, size: label_size})
//         .cx(output_cx)
//         .cy(q_cy + output_height /2 + 20);

//setting background
var static_bg = draw.group();
static_bg.add(queue);
// static_bg.add(output);
static_bg.back();

// draw the line as the path of the data_elems
// function draw_line(enqueue, data) {
//     var lx, ly;
//     if (enqueue){
//         lx = data_l_cx;
//         ly = data_l_cy;
//     }
//     else{
//         lx = output_cx;
//         ly = output_cy;
//     }
//
//     return draw.path(`M ${data.cx()} ${data.cy()}
//                 L ${lx} ${ly}`)
//                 .fill({color: "none"});
// }

class Queue_elem {
    constructor(name) {
        this.data = draw.rect(data_elem_width, data_elem_height)
                            .fill(q_data_color)
                            .cx(data_l_cx)
                            .cy(data_l_cy)
                            .radius(10, 20);
        this.name = draw.plain(name)
                        .font({fill: name_arr[name_arr_idx], family: label_font, size: elem_label_size});
        this.name.center(data_l_cx, data_l_cy);

        this.group = draw.group();
        this.group.add(this.data);
        this.group.add(this.name);

    }

    animate_data(line, clear, toFront) {
        let line_len = line.length();
        this.group.animate(animate_property)
            .during((pos, morph, eased) => {
                let c =
                this.data.center(c.x, c.y);

            })

    }

    x(){
        return this.data.x();
    }
    y(){
        return this.data.y();
    }
    cx(){
        return this.data.cx();
    }
    cy(){
        return this.data.cy();
    }
    width(){
        return this.data.width();
    }
    height(){
        return this.data.height();
    }
    clear(){
        this.group.clear();
    }
    backward(){
        this.group.backward();
    }
}

var q_data = []

function enqueue(){
    var data_name = input.value;
    input.value = "";
    var data = new Queue_elem(data_name);

}

function dequeue(){
    var data = q_data.shift();
    if (data != undefined){
        var line = draw_line(false, data);
        data.animate_data(line, true, true);
        //move other data
        line.remove();
        delete data;
    }
}
// function bounce(){
//     if (bounce_checkbox.checked){
//         animate_property = {duration: 1500, ease: 'bounce'};
//     }
//     else{
//         animate_property = (duration: 800, ease: 'quadInOut');
//     }
// }
//buttons
var enqueue_button = document.getElementById("enqueue"),
    dequeue_button = document.getElementById("dequeue"),
    input = document.getElementById("data");
    // bounce_checkbox = document.getElementById("bounce");

enqueue_button.onclick = enqueue;
dequeue_button.onclick = dequeue;
// bounce_checkbox.onclick = bounce;

input.addEventListener("keyup", function(event){
    event.preventDefault();
    if (event.keyCode === 13){
        enqueue_button.click();
    }
})
