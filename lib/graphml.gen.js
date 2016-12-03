graphmlgen = {
    headers : function (innerXML) {
        return '<?xml version="1.0" encoding="UTF-8"?>'+
               '<graphml><graph id="ir1" edgedefault="directed">\n'+
               innerXML +
               '</graph></graphml>';
    },
    node : function (id, data, innerXML) {
        var dataXML = '';
        for (k in data) {
            dataXML += '<data key="'+k+'">' + escape(data[k]) + '</data>\n';
        }
        return '<node id="'+id+'">' + dataXML + innerXML + '</node>\n';
    },
    subgraph : function (id, innerXML) {
        return '<graph id="'+id+'" edgedefault="directed">\n' + innerXML + '</graph>\n';
    },
    port : function (name) {
        return '<port name="'+name+'"  />\n';
    },
    edge : function (source, target, sourcePort, targetPort) {
        return '<edge source="'+source+'" target="'+target+'" sourceport="'+sourcePort+'" targetport="'+targetPort+'" />\n';
    }
}