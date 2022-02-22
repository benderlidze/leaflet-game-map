const pointsToPolygons = (points, size) => {
    let edges_v = {}, edges_h = {};
    const setEdges = (edges, cmp, e) => {
        points.sort(cmp);
        let edge_index = 0;
        const length = points.length;
        while (edge_index < length) {
            const curr = points[edge_index][e];
            do {
                edges[points[edge_index]] = points[edge_index + 1];
                edges[points[edge_index + 1]] = points[edge_index];
                edge_index += 2
            } while (edge_index < length && points[edge_index][e] == curr);
        }
    };
    setEdges(edges_v, xThenY, 0);
    setEdges(edges_h, yThenX, 1);

    let polygon = [], keys;
    while ((keys = Object.keys(edges_h)).length) {
        const [key] = keys;
        delete edges_h[key];

        const first_vertex = new V2(key);
        let previous = [first_vertex.toArray(), 0];
        let vertices = [first_vertex];

        while (1) {
            const [edge_index, edge] = previous;
            const edges = [edges_v, edges_h][edge];
            const next_vertex = new V2(edges[edge_index]);
            const next = [next_vertex.toArray(), 1 - edge];
            delete edges[edge_index];

            if (first_vertex.compare(next_vertex)) {
                break;
            }

            vertices.push(next_vertex);
            previous = next;
        }

        let scaled_vertices = [];
        for (let vertex of vertices) {
            scaled_vertices.push(vertex.scale(size).toArray());

            const edge_index = vertex.toArray();
            delete edges_v[edge_index];
            delete edges_h[edge_index];
        }

        polygon.push(scaled_vertices);
    }

    return polygon;
};

function V2(x, y) {
    if (Array.isArray(x)) {
        y = x[1];
        x = x[0];
    } else {
        switch (typeof x) {
            case 'object':
                y = x.y;
                x = x.x;
                break;

            case 'string':
                const split = x.split(',');
                x = parseInt(split[0]);
                y = parseInt(split[1]);
                break;
        }
    }

    this.x = x;
    this.y = y;
}

V2.prototype = {
    scale: function (scale) {
        return new V2(this.x * scale, this.y * scale);
    },
    compare: function (v) {
        return this.x == v.x && this.y == v.y;
    },
    toArray: function () {
        return [this.x, this.y];
    }
};

const xThenY = (a, b) => a[0] < b[0] || (a[0] == b[0] && a[1] < b[1]) ? -1 : 1;
const yThenX = (a, b) => a[1] < b[1] || (a[1] == b[1] && a[0] < b[0]) ? -1 : 1;