import React, { Component } from 'react';
import * as d3 from 'd3';
import { pack } from 'd3';

class CirclePackingChart extends Component {
    state = {
        circles: [],
        pictures: [],
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
        const pics = {};
        const circles = fn(nodes).descendants().slice(1).map((circle) => {
            let fill = '#17becf';
            let opacity = '0.7';
            let text = '';
            let tag = '';
            if (circle.data.children) {
                fill = '#000000';
                opacity = '0.1';
                tag = circle.data.name;
                // text = <text textAnchor="middle"><tspan y="0.3em" fontSize="10px">{circle.data.name}</tspan></text>;
            } else {
                tag = circle.parent.data.name;
                text = <text textAnchor="middle"><tspan y="0.3em" fontSize="10px">{circle.data.username[0]}</tspan></text>;
            }
            
            if (circle.data.pic) {
                fill = `url(#circle_pack_${circle.data.id})`;
                pics[circle.data.id] = {
                    pic: circle.data.pic,
                    r: circle.r,
                    id: `circle_pack_${circle.data.id}`
                };
                text = '';
            }
            return {
                id: circle.data.id,
                x: circle.x,
                y: circle.y,
                r: circle.r,
                opacity: opacity,
                fill: fill,
                pic: circle.data.pic,
                text,
                data: circle.data,
                tag: tag
            };
        });

        return { circles, pictures: Object.values(pics) };
    }

    componentDidUpdate() {
    }

    mouseClick = (e) => {
        // console.log('click', this.state.circles[e.target.id].data);
    }
    mouseEnter = (e) => {
        const currentTag = this.state.currentTag;
        // console.log(currentTag, e.target.attributes.tag);
        if (e.target.attributes.tag !== currentTag) {
            console.log('tag:', e.target.attributes.tag);
            this.setState({currentTag: e.target.attributes.tag});
        }
    }

    mouseLeave = (e) => {
    }

    render() {
        return (
            <svg width={this.state.width} height={this.state.height}>
                {this.state.pictures.map((pic, i) => 
                    <defs key={`circle_packing_defs_${i}`}>
                        <pattern id={pic.id} x="0" y="0" width="1" height="1">
                            <image href={pic.pic} x="0" y="0" width={pic.r * 2} height={pic.r * 2}></image>
                        </pattern>
                    </defs>
                )}
                {this.state.circles.map((circle, i) =>
                    (
                        <g key={`circle_packing_${i}`} transform={`translate(${circle.x}, ${circle.y})`}>
                            <circle tag={circle.tag} size={circle.size} id={i} r={circle.r} fillOpacity={circle.opacity} fill={circle.fill} onClick={this.mouseClick} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}></circle>
                            {circle.text}
                        </g>
                    )
                )}
            </svg>
        );
    }
}

export default CirclePackingChart;
