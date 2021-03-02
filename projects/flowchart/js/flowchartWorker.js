function flowchartRun(flowchartJson, input) {
    var $ = go.GraphObject.make;
    var parser = math.parser();
    var stdin = input.split(/\s+/);
    var stdout = "";
    var flowchart = $(go.Diagram);
    flowchart.model = go.Model.fromJson(flowchartJson);
    var current;
    for (var i = flowchart.nodes; i.next();) {
        if (i.value.category == "Begin") {
            current = i.value;
            break;
        }
    }
    while (current.category != "End") {
        switch (current.category) {
            case "Begin":
                var nextNode = current.findLinksOutOf("next");
                nextNode.next();
                current = nextNode.value.toNode;
                break;
            case "Input":
                parser.evaluate(current.data["var"] + " = " + parseFloat(stdin.shift()));
                var nextNode = current.findLinksOutOf("next");
                nextNode.next();
                current = nextNode.value.toNode;
                break;
            case "Output":
                stdout += parser.evaluate(current.data.expr).toString();
                var nextNode = current.findLinksOutOf("next");
                nextNode.next();
                current = nextNode.value.toNode;
                break;
            case "Assign":
                parser.evaluate(current.data["var"] + " = " + current.data.value);
                var nextNode = current.findLinksOutOf("next");
                nextNode.next();
                current = nextNode.value.toNode;
                break;
            case "Condition":
                var nextNode = current.findLinksOutOf(parser.evaluate(current.data.expr) ? "T" : "F");
                nextNode.next();
                current = nextNode.value.toNode;
                break;
        }
    }
    return stdout;
}
