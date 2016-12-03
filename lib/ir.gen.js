helper = {
    isArray : function (value) {
        return (Object.prototype.toString.call(value) === '[object Array]');
    },
    isString : function (value) {
        return typeof value == "string";
    },
    add : function (source, addition) {
        var merged = source;

        if (helper.isArray(addition)) merged = merged.concat(addition);
        else if(!addition.fake) merged.push(addition);

        return merged;
    },
    merge : function (source, left, right) { // three arrays
        var merged = source;

        if (helper.isArray(left)) merged = merged.concat(left);
        else if(!left.fake) merged.push(left);

        if (helper.isArray(right)) merged = merged.concat(right);
        else if((right) && (!right.fake)) merged.push(right);

        return merged;
    }
}

irGenerator = function() {
    var self = this;
    this.parseType = function (astNode) {
        if (astNode === null) return [];
        if (helper.isArray(astNode)) { // Parse as array of parsed instances
            var tuple=[];
            for (var i=0;i<astNode.length;i++) {
                var t=self.parseType(astNode[i]);
                if (helper.isArray(t)) tuple = tuple.concat(t);
                else tuple.push(t);
            }
            return tuple;
        }
        if (helper.isString(astNode) && astNode) {
            return new type.simple(astNode);
        }
        if (astNode.type==="TypedIdList") {
            var dtype, tuple = [];
            dtype = self.parseType(astNode.dtype);
            for (var i=0;i<astNode.ids.length;i++) {
                tuple.push(new port.typedName(astNode.ids[i], dtype));
            }
            return tuple;
        }
        if (astNode.type==="ArrayOf") {
            var dtype;
            dtype = self.parseType(astNode.dtype);
            return new type.array(dtype);
        }
    }

    this.parseRangeGen = function (astNode, inputs) { // Range gen is a special case because it contains scatter and dot nodes
        var outPorts = [];
        var subnodes = [];
        var gen = null;

        if (astNode.type === "RangeFromSource") {
            outPorts.push(new port.typedName(astNode.left, type.simple("auto")));
            if (astNode.at)
                 for (var i = 0; i < astNode.at.length; i++)
                    outPorts.push(new port.typedName(astNode.at[i], type.simple("auto")));
            subnodes = this.parse(astNode.source, inputs);
            gen = new node.rangeFromSource(inputs, outPorts);
        } else if (astNode.type === "RangeList") {
            for (var i = 0; i < astNode.names.length; i++)
                outPorts.push(new port.typedName(astNode.names[i], type.simple("auto")));

            for (var i = 0; i < astNode.ranges.length; i++)
                subnodes = helper.add(subnodes, this.parse(astNode.ranges[i], inputs));
            gen = new node.rangeGen(inputs, outPorts);
        }

        gen.addNodes(subnodes);
        self.connectColored(gen);
        return gen;
    }

    this.parseComplex = function (astNode, complex, inputs) {
        if (!astNode) return new node.fake(0);

        if (helper.isArray(astNode)) {
            for (var i=0;i<astNode.length;i++) {
                var nodes=self.parse(astNode[i], inputs);
                complex.outPorts.push(new port.colored(color.getColor(nodes)));
                complex.addNodes(nodes);
            }
            // Connect SubNodes
            self.connectColored(complex);
            return complex;
        } else {
            throw "Unexpected kind of complex node"
        }
    }

    this.parseLetInit = function (deflist, inputs) {
        var let = new node.virtualComplex();
        var newInputs = inputs;

        if (deflist !== null) {
            var inputNodes = [];

            for (var i = 0; i < deflist.length; i++) {
                var newInput = this.parse(deflist[i], newInputs);
                var tp = new port.typedName((newInput[0] ? newInput[0] : newInput).outPorts[0].name, type.simple("auto"));
                tp.color = (newInput[0] ? newInput[0] : newInput).outPorts[0].color;
                newInputs.push(tp);
                inputNodes = helper.add(inputNodes, newInput);
            }
            let.addNodes(inputNodes);
        }

        return {node:let, newInputs: newInputs};       
    }

    this.parseBody = function (astNode, inputs) { // Body is special case, it conatins self-created ports as "old" values
        return self.parseComplex(astNode, new node.loopBody(inputs, []), inputs);
    }

    this.parseReturns = function (astNode, inputs) {
        return self.parseComplex(astNode.expressions, new node.loopReturn(astNode.reduction.name, inputs, []), inputs);
    }

    this.parseLoopCondition = function (name, astNode, inputs) {
        return self.parseComplex([astNode], new node.typedComplex(name, inputs, []), inputs);
    }

    this.parseLoopInit = function (astNode, inputs) {
        return self.parseComplex(astNode.expressions, new node.loopReturn(astNode.reduction.name, inputs, []), inputs);
    }

    this.parse = function (astNode, inputs, undefined) {
        if (helper.isArray(astNode)) { // Parse as array of parsed instances
            var arr=[];
            for (var i=0;i<astNode.length;i++) {
                arr = helper.add(arr, self.parse(astNode[i], inputs));
            }
            return arr;
        }
        if (helper.isString(astNode) && astNode) {
            if (helper.isArray(inputs)) {
                for (var i = 0; i<inputs.length; i++) {
                    if (inputs[i].id==astNode) return new node.fake(inputs[i].color);
                }
            }
            return new node.identifier(astNode, color.getNew());
        }

        if (astNode === null) return new node.virtualComplex();

        switch (astNode.type) {
            case "Let":
                var letParse = this.parseLetInit(astNode.deflist, inputs);
                var newInputs = letParse.newInputs;
                var let = letParse.node;

                for (var i = 0; i < astNode.body.length; i++) {
                    var nodes=self.parse(astNode.body[i], newInputs);
                    let.outPorts.push(port.colored(color.getColor(nodes)));
                    let.addNodes(nodes);
                }

                return let;

            case "BooleanLiteral":
            case "NumericLiteral":
            case "StringLiteral":
                return new node.constant(astNode.value, color.getNew());

            case "Function":
                var fInputs=self.parseType(astNode.params);
                // Create SubNodes

                color.assign(fInputs);

                var func=new node.func(astNode.name, fInputs, []);
                    // Output ports are created on createAndConnectOutput

                for (var i=0;i<astNode.body.length;i++) {
                    var nodes=self.parse(astNode.body[i], fInputs);
                    func.addNodes(nodes);
                }
                // Connect SubNodes
                self.connectColored(func);
                self.createAndConnectOutput(func);
                func.removeFake();

                return func;

            case "If":
                var condition = new node.virtualComplex();
                var condParts = self.parse(astNode.condition, inputs);
                condition.addNodes(condParts);

                var thenbranch = new node.virtualComplex();
                thenbranch.addNodes(self.parse(astNode.then, inputs));

                var elsebranch = new node.virtualComplex();
                elsebranch.addNodes(self.parse(astNode.else, inputs));

                var elseif = new node.virtualComplex();
                elseif.addNodes(self.parse(astNode.elseif, inputs));

                var ifnode = new node.if(condition, thenbranch, elsebranch, elseif, inputs, [new port.colored(color.getNew())]);
                return ifnode;

            case "ForAll":
                var range = self.parseRangeGen(astNode.range, inputs);
                var body = self.parseBody(astNode.body, helper.merge(range.outPorts, inputs));
                var returns = self.parseReturns(astNode.returns, helper.merge( (body ? body.outPorts : []), range.outPorts, inputs));
                return new node.forAll(range, body, returns, inputs, [new port.colored(color.getColor(returns))]);

            case "For":
                var letParse = this.parseLetInit(astNode.init, inputs);
                var extendedInputs = letParse.newInputs;
                var init = letParse.node;

                var condition = self.parseLoopCondition("condition", astNode.condition, extendedInputs);
                var postcondition = self.parseLoopCondition("postcondition", astNode.postcondition, extendedInputs);
                var body = self.parseBody(astNode.body, extendedInputs);
                var returns = self.parseReturns(astNode.returns, helper.merge( (body ? body.outPorts : []), init.outPorts, extendedInputs));
                return new node.for(init, condition, postcondition, body, returns, inputs, [new port.colored(color.getColor(returns))]);

            case "BinaryExpression":
                var left = self.parse(astNode.left, inputs);
                var right = self.parse(astNode.right, inputs);
                var op = new node.binary(astNode.operator,
                    [new port.colored(color.getColor(left)), new port.colored(color.getColor(right))], [new port.colored(color.getNew())]);

                return helper.merge([op], left, right);

            case "Old":
                var ident = self.parse(astNode.id, inputs);
                var op = new node.old(new port.colored(color.getColor(ident)),
                        new port.colored(color.getNew()));

                return helper.add([op], ident);

            case "Array":
            case "Tuple":
            case "Call":
            case "[]":
                var tuple = null;

                if (astNode.type === "Tuple")
                    tuple = [new node.tuple([], new port.colored(color.getNew()))];

                if (astNode.type === "Array")
                    tuple = [new node.array([], new port.colored(color.getNew()))];

                if (astNode.type === "Call")
                    tuple = [new node.call(astNode.name, [], new port.colored(color.getNew()))];

                if (astNode.type === "[]")
                    tuple = [new node.element([], [new port.colored(color.getNew())])];

                var subnodes = self.parse(astNode.contents);
                var inPorts = [];
                for (var i = 0; i < astNode.contents.length; i++) {
                    var tuplePart = self.parse(astNode.contents[i], inputs);
                    tuple[0].inPorts.push(new port.colored(color.getColor(tuplePart)));
                    tuple = helper.add(tuple, tuplePart);
                }
                return tuple;

            case "Range":
                var left = self.parse(astNode.left, inputs);
                var right = self.parse(astNode.right, inputs);
                var op = new node.range(
                    [new port.colored(color.getColor(left)), new port.colored(color.getColor(right))], [new port.colored(color.getNew())]);
                return helper.merge([op], left, right);

            case "Dot":
                var dotcolor = color.getNew();
                var field = new node.constant(astNode.field, dotcolor);
                var dot = new node.unary(".", new port.colored(dotcolor), new port.colored(color.getNew()));
                return [dot, field];

            case "Unary":
                var operand = self.parse(astNode.operand);
                var op = new node.unary(astNode.operation, new port.colored(color.getColor(operand)), new port.colored(color.getNew()));
                return helper.add([op], operand);

            case "Definition":
                var def = self.parse(astNode.right, inputs);
                (def[0] ? def[0]: def).outPorts[0].name = astNode.left[0]; //out port comes first that's why zero
                // TODO: fix 0
                return def;

            case "Postfix":
                var base = self.parse(astNode.base, inputs);
                var nodes = [];
                var current, prev = null;

                for (var i = astNode.opList.length-1; i>=0; i--) {
                    current = self.parse(astNode.opList[i], inputs);
                    nodes = helper.merge(nodes, current);
                    if (prev !== null) {
                        (prev[0] ? prev[0] : prev).inPorts[0].color =
                            (current[0] ? current[0] : current).outPorts[0].color;
                    }
                    prev = current;
                }
                current[0].inPorts[0].color = color.getColor(base);
                nodes.push(base);
                return nodes;

            default: throw "Unexpected node type: " + astNode.type;
        }
    }

    this.notConnectedOutput = function (cNode, nodeNum, outPortNum) {
        for (var i=0; i < cNode.edges.length; i++) {
            if (cNode.edges[i].nodeFrom == nodeNum && cNode.edges[i].portFrom == outPortNum)
                return false;
        }
        return true;
    }

    this.createAndConnectOutput = function (cNode) {
        var outPortNum = 0;
        for (var i = 0; i < cNode.nodes.length; i++)
            for (var j = 0; j < cNode.nodes[i].outPorts.length; j++) {
                if (self.notConnectedOutput(cNode, i, j)) {
                    cNode.edges.push(new edge.single(i, j, -1, outPortNum++));
                    cNode.outPorts.push(new port.empty());
                }
            }
    }

    this.connectColored = function (cNode) { // input is a complex node
        if (helper.isArray(cNode.inPorts) && helper.isArray(cNode.nodes)) {
            for (var i = 0; i < cNode.inPorts.length; i++) {
                if (!cNode.inPorts[i].color) continue;
                for (var j = 0; j< cNode.nodes.length; j++) {
                    for (var k = 0; k< cNode.nodes[j].inPorts.length; k++) {
                        if (cNode.inPorts[i].color==cNode.nodes[j].inPorts[k].color) {
                            cNode.edges.push(new edge.single(-1, i, j, k));
                        }
                    }
                }
            }
        }
        if (helper.isArray(cNode.inPorts) && helper.isArray(cNode.outPorts)) {
            for (var i = 0; i < cNode.inPorts.length; i++) {
                if (!cNode.inPorts[i].color) continue;
                for (var j = 0; j< cNode.outPorts.length; j++) {
                    if (cNode.inPorts[i].color==cNode.outPorts[j].color) {
                        cNode.edges.push(new edge.single(-1, i, -1, j));
                    }
                }
            }
        }
        if (helper.isArray(cNode.outPorts) && helper.isArray(cNode.nodes)) {
            for (var i = 0; i < cNode.outPorts.length; i++) {
                if (!cNode.outPorts[i].color) continue;
                for (var j = 0; j< cNode.nodes.length; j++) {
                    for (var k = 0; k< cNode.nodes[j].outPorts.length; k++) {
                        if (cNode.outPorts[i].color==cNode.nodes[j].outPorts[k].color) {
                            cNode.edges.push(new edge.single(j, k, -1, i));
                        }
                    }
                }
            }
        }
        if (helper.isArray(cNode.nodes)) {
            for (var l = 0; l < cNode.nodes.length; l++) {
                if (!helper.isArray(cNode.nodes[l].outPorts)) continue;

                for (var i = 0; i < cNode.nodes[l].outPorts.length; i++) {
                    if (!cNode.nodes[l].outPorts[i].color) continue;
                    for (var j = 0; j< cNode.nodes.length; j++) {
                        for (var k = 0; k< cNode.nodes[j].inPorts.length; k++) {
                            if (cNode.nodes[l].outPorts[i].color==cNode.nodes[j].inPorts[k].color) {
                                cNode.edges.push(new edge.single(l, i, j, k));
                            }
                        }
                        if (!cNode.nodes[l].fake && cNode.nodes[j].fake && cNode.nodes[j].color &&
                            cNode.nodes[j].color==cNode.nodes[l].outPorts[i].color) {
                                cNode.nodes[j].inPorts.push(new port.colored(0));
                                cNode.edges.push(new edge.single(l, i, j, 0));                          
                        }
                    }
                }
            }
        }
    }
}