export const getColor = (id): string  => {
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += (id.charCodeAt(i)%16).toString(16);        
    }
    
    return color;
}