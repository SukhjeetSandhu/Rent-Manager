const round = (value = 0, precision = 2) => {
    const multiplier = 10 ** (precision);
    return (Math.round(Number(value) * multiplier) / multiplier) || 0;
};

export  { round }