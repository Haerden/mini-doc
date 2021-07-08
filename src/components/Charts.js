


import { useState, useEffect } from 'react';
const F2 = require('@antv/f2');

function Charts() {
    const [count, setCount] = useState(1);

    useEffect(() => {
        const data = [
            { genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 },
        ];

        // Step 1: 创建 Chart 对象
        const chart = new F2.Chart({
            id: 'myChart',
            pixelRatio: window.devicePixelRatio
        });

        // Step 2: 载入数据源
        chart.source(data);

        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        chart.interval().position('genre*sold').color('genre');

        // Step 4: 渲染图表
        chart.render();
    });
    const click = () => {
        setCount(2);
    };
    return (
        <div>
            <p onClick={click}>{count}</p>
            <canvas id="myChart" width="400" height="260"></canvas>
        </div>
    )
}

export default Charts;