export function makeNode(id: string, name: string, inPorts: number,
                         outPorts: number, subGraph: string = ""): string {
  const genFunction = (prefix: string, quantity: number) => {
    return (Array.from(new Array(quantity),
       (val, index) => "<port name=\"" + prefix + String(index) + "\">").join(""));
  };

  return `<node id="${id}"><data key="type">${name}</data>` +
         genFunction("in", inPorts) +
         genFunction("out", outPorts) +
         subGraph +
         "</node>";
}

export function makeEdge(idFrom: string, portFrom: number,
                         idTo: string, portTo: number,
                         inner: boolean = false): string {
  return `<edge source="${idFrom}" target="${idTo}" sourceport="out${portFrom}" ` +
         `targetport="` + (inner ? "out" : "in") + portTo + `"/>`;
}

export function makeDocument(contents: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <graphml xmlns="http://graphml.graphdrawing.org/xmlns"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
          http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
    <key id="type" for="node" attr.name="nodetype" attr.type="string" />
${contents}
</graphml>`;
}

export function makeGraph(id: string, contents: string): string {
  return `<graph id="${id}" edgedefault="directed">${contents}</graph>`;
}
