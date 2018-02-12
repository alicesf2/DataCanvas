const SVG = require('svg.js');

var draw = SVG('drawing').size(500, 500);
var ellipse = draw.ellipse(100, 100).attr('cx', '20%').fill('#333')
var rect = draw.rect(200,200).fill({color: "none"});

rect.animate(3000).move(100, 100).during(function(pos, morph, eased, situation) {
  // numeric values
  ellipse.size(morph(100, 200), morph(100, 50))

  // unit strings
  ellipse.attr('cx', morph('20%', '80%'))

  // hex color strings
  ellipse.fill(morph('#333', '#ff0066'))
})
