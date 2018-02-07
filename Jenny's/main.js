const SVG = require('svg.js');

var draw = SVG('drawing').size(500, 500);
var leftBound = draw.line(100, 100, 100, 400)
    .stroke({width : 5, color: "rgb(139, 63, 47)", linecap: "round"});
var rightBound = draw.line(200, 100, 200, 400)
    .stroke({width : 5, color: "rgb(139, 63, 47)", linecap: "round"});
