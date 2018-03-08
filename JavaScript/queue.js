//implementation of queue
//fifo
/*
q.enqueue()
q.dequeue()
*/

const q_cx = 400,
    q_cy = 200,
    q_struct_width = 480,
    q_struct_height = 110,
    q_stroke_width = 5,
    //bounds
    LEFT = q_cx - q_struct_width / 2,
    RIGHT = q_cx + q_struct_width / 2,
    UPPER = q_cy - q_struct_height / 2,
    LOWER = q_cy + q_struct_height / 2,
    //data_elem params
    data_elem_width = 90,
    data_elem_height = 90,
    data_l_cx = LEFT - data_elem_width,
    data_l_cy = q_cy,
    data_output_x = RIGHT + data_elem_width / 2,
    //labels
    q_label_font = "comic sans ms",
    q_label_size = 30,
    elem_label_size = 23,
    //colors
    q_frame_color = '#7b2d26',
    empty = '#FFFFFF',
    //numbers
    data_queue_gap = 2,
    data_max = 5,
    //data name color arr
    // name_arr = ['#ffe1d4', '#e0f6f5', '#f5f5f5'],
    name_arr = [empty, empty, empty],
    fill_cr_arr = ['#ab4a43', '#05a8aa', '#aba194'],
    stroke_cr_arr = ['#7b2d26', '#0b7a75', '#634e32'],
    //text wrap threshold
    threshold = 7;

//name arr index
var data_idx = 0;
var enqueue_duration = 1000;
var move_to_cx = 0;

//canvas
var queue_draw = SVG('queueAnimation').size(0, 0);

function drawQueue() {
    queue_draw.size(810, 600);
    //queue structure
    var upper = queue_draw.line(LEFT, UPPER, RIGHT, UPPER)
    upper.stroke({
        color: q_frame_color,
        width: q_stroke_width,
        linecap: 'round'
    });

    var lower = queue_draw.line(LEFT, LOWER, RIGHT, LOWER)
    lower.stroke({
        color: q_frame_color,
        width: q_stroke_width,
        linecap: 'round'
    });
    var q_struct_label = queue_draw.plain("Queue")
        .font({
            family: q_label_font,
            fill: q_frame_color,
            size: q_label_size
        })
        .cx(q_cx)
        .cy(LOWER + 20);
    //group queue
    var queue = queue_draw.group()
    queue.add(upper)
    queue.add(lower)
    queue.add(q_struct_label)

    //setting background
    var static_bg = queue_draw.group();
    static_bg.add(queue);
    // static_bg.add(output);
    static_bg.back();

}

// a list to store queue data
var q_data = []

function clearQueue() {
    queue_draw.clear();
    queue_draw.size(0, 0);
    q_data.length = 0;
}


function splitText(text, hold) {
    var textLength = text.length;
    console.log("textLength " + textLength);
    var arrLength = textLength / hold;
    var split = [];
    var i = 0,
        j = 0;
    k = hold;
    for (; i < arrLength; i++) {
        var t_seg = text.slice(j, k);
        split.push(t_seg);
        j += hold;
        k += hold;
    }

    return split;
}

// function createData(name) {
//   group = queue_draw.group();
//   data = group.rect(data_elem_width, data_elem_height)
//                       .fill(empty)
//                       .cx(data_l_cx)
//                       .cy(data_l_cy)
//                       .radius(20, 20)
//                       .stroke({color: empty, width: data_stroke_width});
//   if (name.length < 6){
//       name = group.plain(name).font({fill: empty, family: q_label_font, size: elem_label_size});
//       name.center(data_l_cx, data_l_cy);
//   }
//   else{
//       var lines = splitText(name, 6);
//       for (var i = 0, j = 0; i < lines.length; i++, j + 50){
//           line = group.plain(lines[i]).font({fill: empty, family: q_label_font, size: elem_label_size});
//           line.center(data_l_cx, data_l_cy + 50);
//       }
//   }
//   group.back();
//   return group;
// }

function createData(name) {
    group = queue_draw.group();
    data = group.rect(data_elem_width, data_elem_height)
        .fill(empty)
        .cx(data_l_cx)
        .cy(data_l_cy)
        .radius(20, 20)
        .stroke({
            color: empty,
            width: data_stroke_width
        });
    // name = group.plain(name).font({fill: empty, family: q_label_font, size: elem_label_size});
    // name.center(data_l_cx, data_l_cy);
    if (name.length < 7) {
        name = group.plain(name).font({
            fill: empty,
            family: q_label_font,
            size: elem_label_size
        });
        name.center(data_l_cx, data_l_cy);
    } else {
        var lines = splitText(name, threshold);
        // var line = [];
        console.log("lines.length " + lines.length);
        var recenter = data_l_cy;
        recenter -= 20 * (lines.length - 1) * 0.5;
        for (var i = 0, j = 0; i < lines.length; i++, j += 20) {
            line = group.text(lines[i]).font({
                fill: empty,
                family: q_label_font,
                size: elem_label_size
            });
            console.log("uhhhhh" + i);
            line.center(data_l_cx, recenter + j);
            console.log("data_l_cy + l " + recenter + j);
        }
    }

    group.back();
    return group;
}

function enqueue() {
    var data_name = queue_input.value;
    queue_input.value = "";
    var data = createData(data_name);
    // determine where to move to
    if (q_data.length < data_max) {
        move_to_cx = RIGHT - (q_data.length + 1 / 2) * (data_elem_width + data_stroke_width) - data_l_cx - data_stroke_width;
        console.log("move to cx " + move_to_cx);
    } else {
        move_to_cx = RIGHT - q_data.length * 3 - (data_max - 1 / 2) * (data_elem_width + data_stroke_width) - data_l_cx;
        console.log("move to cx " + move_to_cx);
    }
    enqueue_duration = Math.abs(move_to_cx) * 2;
    data.get(0).animate(500).stroke({
        color: stroke_cr_arr[data_idx]
    }).fill(fill_cr_arr[data_idx]);
    data.get(1).animate(500).font({
        fill: name_arr[data_idx]
    });
    data.animate(enqueue_duration, "<>", 500).x(move_to_cx);
    data_idx += 1;
    data_idx %= fill_cr_arr.length;
    q_data.push(data);
}

function dequeue() {
    var data = q_data.shift();
    if (data != undefined) {
        data.front();
        data.animate(500, "-").x(data_output_x).after(() => {
            for (var i = 0; i < q_data.length; i++) {
                // if (i == 0) {
                //   q_data[i].animate(300).dx(data_elem_width + data_stroke_width);
                //   console.log("i " + i);
                //   console.log("lalala" + q_data[i].x());
                //
                // } else {
                //   q_data[i].animate(300).x(q_data[i-1].x());
                //   console.log("i " + i);
                //   console.log(q_data[i].x());
                // }
                if (i < data_max) {
                    move_right = RIGHT - (i + 1 / 2) * (data_elem_width + data_stroke_width) - data_l_cx - data_stroke_width;
                    q_data[i].animate(300).x(move_right);
                    console.log("lalala" + q_data[i].x());
                } else {
                    move_right = RIGHT - i * 3 - (data_max - 1 / 2) * (data_elem_width + data_stroke_width) - data_l_cx
                    q_data[i].animate(300).x(move_right);
                    console.log(q_data[i].x());
                }
            }
        }).after(() => {
            data.get(0).animate(500, "<", 500).fill({
                color: "#ffffff"
            }).stroke({
                color: "#ffffff"
            });
            data.get(1).animate(500, "<", 500).font({
                    fill: "rgb(255, 255, 255)"
                })
                .after(() => {
                    data.remove();
                });
        })
        delete data;
    }
}

//buttons
var enqueue_button = document.getElementById("enqueue"),
    dequeue_button = document.getElementById("dequeue"),
    queue_input = document.getElementById("queueData");
// bounce_checkbox = document.getElementById("bounce");

enqueue_button.onclick = enqueue;
dequeue_button.onclick = dequeue;
// bounce_checkbox.onclick = bounce;

queue_input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        enqueue_button.click();
    }
})
