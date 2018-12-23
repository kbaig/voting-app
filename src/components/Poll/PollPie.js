import React from 'react';

import { Pie } from 'react-chartjs-2';

const PollPie = ({ options }) => {
    const n = options.length;
    const colors = options.map((option, i) => {
        const lightness = Math.floor((i / n) * 70) + 15;
        return `hsl(212, 100%, ${lightness}%)`;
    });


    const data = {
        labels: options.map(option => option.name),
        datasets: [{
            data: options.map(option => option.votes),
            backgroundColor: colors
        }]
    };

    const chartOptions = {
        legend: { position: 'right' }
    };

    return (
        <Pie data={ data } options={ chartOptions } />
    );
};

export default PollPie;