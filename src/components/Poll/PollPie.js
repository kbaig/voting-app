import React from 'react';

import { Pie } from 'react-chartjs-2';

const PollPie = ({ options }) => {
    const data = {
        labels: options.map(option => option.name),
        datasets: [{ data: options.map(option => option.votes) }]
    };

    return <Pie data={ data }/>;
};

export default PollPie;