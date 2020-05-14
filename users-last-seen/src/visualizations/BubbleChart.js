import React, { Component } from 'react';
import * as d3 from 'd3';
import { pack, sum } from 'd3';

const width = 650;
const height = 400;

class BubbleChart extends Component {
    state = {
        circles: []
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.data || typeof nextProps.data.length === 'undefined') return null; // data hasn't been loaded yet so do nothing

        const data = nextProps.data;
        const nodes = (d3.hierarchy({children: data})
            .sum(d => d.size));
        const fn = pack(nodes).size([width, height]);
        const circles = fn(nodes).children.map((circle) => {
            let fill = '#17becf';
            console.log(circle.r, circle);
            return {
                x: circle.x,
                y: circle.y,
                r: circle.r,
                fill: fill
            };
        });

        return { circles };
    }

    componentDidUpdate() {
    }

    render() {

        return (
            <svg width={width} height={height}>
                {this.state.circles.map((circle, i) =>
                    (
                        <g key={i} transform={`translate(${circle.x}, ${circle.y})`}>
                            <circle id={i} r={circle.r} fillOpacity={0.7} fill={circle.fill}></circle>
                        </g>
                    )
                )}
            </svg>
        );
    }
}

export default BubbleChart;
