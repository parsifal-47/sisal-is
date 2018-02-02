node = {
    complex : { // Interface class for all complex nodes
        addNodes : function (node) {
            if (!node) return;

            if (helper.isArray(node)) {
                this.nodes = this.nodes.concat(node);
                return;
            }

            // If the node is complex it has to be disassembled
            if (node.pureVirtual) { //node instanceof virtualComplexNode) { -- this typing is not working, using duck typing
                var increment=this.nodes.length;
                for (var i=0;i<node.nodes.length;i++)
                    this.nodes.push(node.nodes[i]);
                // copy variables
                for (var i=0;i<node.edges.length;i++) {
                    this.edges.push(new edge.single(node.edges[i].nodeFrom===-1?-1:node.edges[i].nodeFrom+increment, portFrom,
                                                            node.edges[i].nodeTo===-1?-1:node.edges[i].nodeTo+increment, portTo));
                }
            } else
                this.nodes.push(node);
        },
        removeNode : function (nodeId) {
            this.nodes.splice(nodeId, 1);
            var i = 0;
            while (i<this.edges.length) {
                if ((this.edges[i].nodeFrom == nodeId) || (this.edges[i].nodeTo == nodeId)) {
                    this.edges.splice(i, 1);
                } else {
                    if (this.edges[i].nodeFrom > nodeId) this.edges[i].nodeFrom--;
                    if (this.edges[i].nodeTo > nodeId) this.edges[i].nodeTo--;                    
                    i++;
                }
            }
        },
        overConnect: function (nodeId) {
            if (this.nodes[nodeId].inPorts.length == 0 || this.nodes[nodeId].outPorts.length == 0) return;
            for (var i = 0; i < this.edges.length; i++)
                for (var j = 0; j < this.edges.length; j++) {
                    if (this.edges[i].nodeTo == nodeId && this.edges[j].nodeFrom == nodeId &&
                        this.edges[i].portTo == this.edges[j].portFrom) {
                        this.edges.push(new edge.single(this.edges[i].nodeFrom, this.edges[i].portFrom,
                            this.edges[j].nodeTo, this.edges[j].portTo));
                    }
                }
        },
        removeFake : function () {
            for (var i = 0; i < this.nodes.length;)
                if (this.nodes[i].fake) {
                    this.overConnect(i);
                    this.removeNode(i);
                } else i++;

        },
        toXML : function (id) {
            var innerXML = '';
            var i;
            var data = {type:this.type};
            if (typeof this.fields !== "undefined") for (i=0; i<this.fields.length; i++) data[this.fields[i]] = this[this.fields[i]];

            for (i=0; i<this.inPorts.length; i++) innerXML += graphmlgen.port('in' + i);
            for (i=0; i<this.outPorts.length; i++) innerXML += graphmlgen.port('out' + i);
            for (i=0; i<this.nodes.length; i++) innerXML += this.nodes[i].toXML(id + '::n' + i);
            for (i=0; i<this.edges.length; i++) innerXML += edge.toXML(id, this.edges[i]);
            return graphmlgen.node(id, data, graphmlgen.subgraph(id + ':', innerXML));
        },
        execute : function () {
            // wave dataflow
            var left = [];
            var changed, i, j;

            for (i=0; i<this.nodes.length; i++) left.push(i);
            do {
                changed = 0;
                for (i=0;i<this.nodes.length;i++) 
                    if (((typeof this.nodes[i].ready=="undefined") || this.nodes[i].ready()) && left.indexOf(i)!==-1) {
                        left.splice(left.indexOf(i), 1);
                        this.nodes[i].execute();
                        for (j=0; j<this.edges.length;j++)
                            if ((this.edges[j].nodeFrom === i) && 
                                this.nodes[i].outPorts[this.edges[j].portFrom].value) {
                                var nodeTo = this.edges[j].nodeTo;
                                if (nodeTo === -1)
                                    this.outPorts[this.edges[j].portTo] = this.nodes[i].outPorts[this.edges[j].portFrom].value;
                                else
                                    this.nodes[nodeTo].inPorts[this.edges[j].portTo].value = 
                                        this.nodes[i].outPorts[this.edges[j].portFrom].value;
                            }
                        // connect data via edges
                        changed = 1;
                        break;
                    }
            } while (changed);
        },
        toText : function () {
            var inFree = 0, outFree = 0; // Number of non-assigned input and output ports
            for (i=0; i<this.outPorts.length; i++)
                if (!this.outPorts.value) outFree++;
            for (i=0; i<this.inPorts.length; i++)
                if (!this.inPorts.value) inFree++;
            if (inFree === 0) {
                return this.outPorts.toString();
            } else {
                return this.inPorts.toString() + " -> " + this.outPorts.toString();
            }
        }
    },
    simple : {
        toXML : function (id) {
            var innerXML = '';
            var i;
            var data = {type:this.type};
            if (typeof this.fields !== "undefined") for (i=0; i<this.fields.length; i++) data[this.fields[i]] = this[this.fields[i]];
            
            for (i=0; i<this.inPorts.length; i++) innerXML += graphmlgen.port('in' + i);
            for (i=0; i<this.outPorts.length; i++) innerXML += graphmlgen.port('out' + i);
            return graphmlgen.node(id, data, innerXML);
        },
        ready : function () {
            for (var i = 0; i < this.inPorts.length; i++)
                if (!this.inPorts[i].value) return 0;
            return 1;
        }
    }
}
node.virtualComplex = function () {
        this.nodes = [];
        this.edges = [];
        this.inPorts =  [];
        this.outPorts = [];
        this.pureVirtual = true;
        this.toText = function () {
            var str = "";
            for (var i = 0; i < this.nodes.length; i++) {
                var notConnected = 1;
                for (var j = 0; j< this.edges.length; j++) {
                    if (this.edges[j].nodeFrom === i) {
                        notConnected = 0;
                        break;
                    }
                }
                if (notConnected) {
                    str += this.nodes[i].toText();
                }
            }
            return str;
        }
    }

node.virtualComplex.prototype = node.complex;

node.func = function (name, inPorts, outPorts) {
        var self = this;
        this.type = "function";
        this.name = name;
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [];
        this.edges = [];
        this.fields = ["name"];
    }

node.func.prototype = node.complex;

node.loopBody = function (inPorts, outPorts) {
        this.type = "loopBody";
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [];
        this.edges = [];
    }

node.loopBody.prototype = node.complex;

node.loopReturn = function (name, inPorts, outPorts) {
        this.type = "loopReturn";
        this.name = name;
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [];
        this.edges = [];
    }

node.loopReturn.prototype = node.complex;

node.typedComplex = function (name, inPorts, outPorts) {
        this.type = name;
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [];
        this.edges = [];
    }

node.typedComplex.prototype = node.complex;

node.rangeGen = function (inPorts, outPorts) {
        this.type = "rangeGen";
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [];
        this.edges = [];
    }

node.rangeGen.prototype = node.complex;

node.rangeFromSource = function (inPorts, outPorts) {
        this.type = "rangeFromSource";
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [];
        this.edges = [];
    }

node.rangeFromSource.prototype = node.complex;

node.forAll = function (range, body, returns, inPorts, outPorts) {
        this.type = "forall";
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [range, body, returns];
        this.edges = []; // There are no explicit connections also
    }

node.forAll.prototype = node.complex;

node.for = function (init, condition, postcondition, body, returns, inPorts, outPorts) {
        this.type = "forall";
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [init, condition, postcondition, body, returns];
        this.edges = []; // There are no explicit connections also
    }

node.for.prototype = node.complex;

node.if = function (condition, ifbranch, elsebranch, elseif, inPorts, outPorts) {
        this.type = "if";
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.nodes = [condition, ifbranch, elsebranch, elseif];
        this.edges = []; // There are no explicit connections also
    }

node.if.prototype = node.complex;

node.binary = function (op, inPorts, outPorts) {
        this.type = "binary";
        this.op = op;
        this.inPorts = inPorts;
        this.outPorts = outPorts;
        this.fields = ["op"];
        this.toText = function () {if (typeof this.outPorts[0].value!="undefined") return this.outPorts[0].value; else return this.op;}
        this.ready = function () {return ((typeof this.inPorts[0].value!="undefined") && (typeof this.inPorts[1].value!="undefined"));}
        this.execute = function () {
            switch (this.op) {
                case "+": 
                    this.outPorts[0].value = this.inPorts[0].value + this.inPorts[1].value;
                    break;
                case "-": 
                    this.outPorts[0].value = this.inPorts[0].value - this.inPorts[1].value;
                    break;
                case "*": 
                    this.outPorts[0].value = this.inPorts[0].value * this.inPorts[1].value;
                    break;
                case "/": 
                    this.outPorts[0].value = this.inPorts[0].value / this.inPorts[1].value;
                    break;
                default:
                    this.outPorts[0].value = 0;
            }
        }
    }

node.binary.prototype = node.simple;

node.unary = function (op, inPort, outPort) {
        this.type = "unary";
        this.op = op;
        this.inPorts = [inPort];
        this.outPorts = [outPort];
        this.fields = ["op"];
    }

node.unary.prototype = node.simple;

node.element = function (inPorts, outPorts) {
        this.type = "element";
        this.inPorts = inPorts;
        this.outPorts = outPorts;
    }

node.element.prototype = node.simple;

node.range = function (inPorts, outPorts) {
        this.type = "range";
        this.inPorts = inPorts;
        this.outPorts = outPorts;
    }

node.range.prototype = node.simple;

node.tuple = function (inPorts, outPort) {
        this.type = "tuple";
        this.inPorts = inPorts;
        this.outPorts = [outPort];
    }

node.tuple.prototype = node.simple;

node.array = function (inPorts, outPort) {
        this.type = "array";
        this.inPorts = inPorts;
        this.outPorts = [outPort];
    }

node.array.prototype = node.simple;

node.call = function (name, inPorts, outPort) {
        this.type = "call";
        this.name = name;
        this.inPorts = inPorts;
        this.outPorts = [outPort];
    }

node.call.prototype = node.simple;

node.old = function (inPort, outPort) {
        this.type = "old";
        this.inPorts = [inPort];
        this.outPorts = [outPort];
    }

node.old.prototype = node.simple;

node.scatter = function (inPort, outPort) {
        this.type = "scatter";
        this.inPorts = [inPort];
        this.outPorts = [outPort];
    }

node.scatter.prototype = node.simple;

node.identifier = function (id, color) { // port with name
        this.type = "id";
        this.inPorts = [];
        this.outPorts = [new port.colored(color)];
        this.id = id;
        this.color = color;
    }

node.identifier.prototype = node.simple;

node.constant = function (value, color) { // port with name
        var self = this;
        this.type = "constant";
        this.inPorts = [];
        this.outPorts = [new port.colored(color)];
        this.value = value;
        this.color = color;
        this.fields = ["value"];
        this.toText = function () {return this.value;}
        this.execute = function () {this.outPorts[0].value = this.value;}
    }

node.constant.prototype = node.simple;

node.fake = function (color) {
        this.inPorts = [new port.colored(color)];
        this.outPorts = [new port.newColored()];
        this.color = color;
        this.fake = 1;
    }

node.fake.prototype = node.simple;

node.sisalir = function(ast){ // constructs sisal IR from Abstract syntax tree
    var irGen = new irGenerator();
    var self = this;
    this.container = new node.virtualComplex();

    this.container.addNodes(irGen.parse(ast));
    irGen.connectColored(this.container);

    this.toGraphML = function () {
        var xmlstr = '';
        for (var i=0; i<self.container.nodes.length; i++) {
           xmlstr += self.container.nodes[i].toXML("n" + i);
        }
        return graphmlgen.headers(xmlstr);    
    }
    this.execute = function () {
        return self.container.execute();
    }
    this.toText = function () {
        return self.container.toText();
    }
}