export const generateRandomColor = (index: number) => {
    const hue = (index * 146) % 360;
    return `hsl(${hue}, 42%, 56%, 1.00)`;
};