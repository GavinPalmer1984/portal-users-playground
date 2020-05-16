import React, { Component } from 'react';
import * as d3 from 'd3';
import { pack } from 'd3';

class BubbleChart extends Component {
    state = {
        circles: [],
        width: window.innerWidth / 2,
        height: window.innerWidth / 2
    };
    updateDimensions = () => {
        this.setState({ width: window.innerWidth / 2, height: window.innerWidth / 2 });
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.data || typeof nextProps.data.length === 'undefined') return null; // data hasn't been loaded yet so do nothing

        const data = nextProps.data;
        const nodes = (d3.hierarchy({ children: data })
            .sum(d => d.size)
            .sort((a, b) => b.value - a.value));
        const fn = pack(nodes).size([prevState.width, prevState.height]);
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
                text,
                data: circle.data
            };
        });

        return { circles };
    }

    componentDidUpdate() {
    }

    mouseClick = (e) => {
        console.log('click', this.state.circles[e.target.id].data);
    }
    mouseEnter = (e) => {
        console.log('hover', this.state.circles[e.target.id].data);
    }

    mouseLeave = (e) => {
    }

    render() {

        return (
            <svg width={this.state.width} height={this.state.height}>
                {this.state.circles.map((circle, i) =>
                    (
                        <g key={i} transform={`translate(${circle.x}, ${circle.y})`}>
                            <defs>
                                <pattern id={circle.id} x="0" y="0" width="1" height="1">
                                    <image href={circle.pic} x="0" y="0" width={circle.r * 2} height={circle.r * 2}></image>
                                </pattern>
                            </defs>
                            <circle size={circle.size} id={i} r={circle.r} fillOpacity={0.7} fill={circle.fill} onClick={this.mouseClick} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}></circle>
                            {circle.text}
                        </g>
                    )
                )}
            </svg>
        );
    }
}

export default BubbleChart;
