import React, { Component } from 'react';
import * as d3 from 'd3';
import { pack } from 'd3';

const width = 650;
const height = 400;

class BubbleChart extends Component {
    state = {
        circles: []
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.data || typeof nextProps.data.length === 'undefined') return null; // data hasn't been loaded yet so do nothing

        const data = nextProps.data;
        const nodes = (d3.hierarchy({ children: data })
            .sum(d => d.size));
        const fn = pack(nodes).size([width, height]);
        const circles = fn(nodes).children.map((circle) => {
            let fill = '#17becf';
            let text = <text textAnchor="middle"><tspan y="0.3em" fontSize="10px">{circle.data.username[0]}</tspan></text>;
            if (circle.data.pic) {
                fill = `url(#${circle.data.id})`;
                text = '';
            }
            return {
                id: circle.data.id,
                x: circle.x,
                y: circle.y,
                r: circle.r,
                fill: fill,
                pic: circle.data.pic,
                text
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
                            <defs>
                                <pattern id={circle.id} x="0" y="0" width="1" height="1">
                                    <image href={circle.pic} x="0" y="0" width={circle.r * 2} height={circle.r * 2}></image>
                                </pattern>
                            </defs>
                            <circle id={i} r={circle.r} fillOpacity={0.7} fill={circle.fill}></circle>
                            {circle.text}
                        </g>
                    )
                )}
            </svg>
        );
    }
}

export default BubbleChart;
