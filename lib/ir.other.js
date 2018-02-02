color = {
  current : 0,
  getNew : function() {
    this.current += 1;
    return this.current;
  },
  getColor : function(nodes) {
    if (helper.isArray(nodes))
      return this.getColor(nodes[0]); // output node always come first
    if (helper.isArray(nodes.outPorts) && (!nodes.fake)) {
      if (!nodes.outPorts[0])
        return 0; // no out port -- no color
      return nodes.outPorts[0].color;
    }
    return nodes.color;
  },
  assign : function(nodes) {
    if (helper.isArray(nodes)) {
      for (var i = 0; i < nodes.length; i++)
        nodes[i].color = this.getNew();
    } else
      nodes.color = this.getNew();
  }
}

type = {
  simple : function(name) { this.name = name; },

  array : function(subType) {
    this.isArray = true;
    this.subType = subType;
  }
}

edge = {
  single : function(nodeFrom, portFrom, nodeTo, portTo) {
    this.nodeFrom = nodeFrom;
    this.portFrom = portFrom;
    this.nodeTo = nodeTo;
    this.portTo = portTo;
  },
  toXML : function(id, e) {
    return graphmlgen.edge(e.nodeFrom < 0 ? id : id + "::n" + e.nodeFrom,
                           e.nodeTo < 0 ? id : id + "::n" + e.nodeTo,
                           (e.nodeFrom < 0 ? "in" : "out") + e.portFrom,
                           (e.nodeTo < 0 ? "out" : "in") + e.portTo);
  }
}

port = {
  colored : function(color) { // colored port
    this.color = color;
  },
  newColored : function() { this.color = color.getNew(); },
  empty : function() {},
  typedName : function(id, dtype) { // port with name & type
    this.id = id;
    this.dtype = dtype;
  }
}
