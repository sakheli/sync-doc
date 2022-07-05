export const  getName = (id): string  => {
    const animals = [
            'Kangaroo',
            'Monkey',
            'Snake',
            'Zebra',
            'Lion',
            'Giraffe',
            'Dog',
            'Tiger',
            'Vulture',
            'Ostrich',
            'Eagle',
            'Antelope',
            'Hippo',
            'Bull',
            'Cat',
            'Panda'
        ];
    
    let randIndex = (id.charCodeAt(0)+
                 id.charCodeAt(1)+
                 id.charCodeAt(2)+
                 id.charCodeAt(3)+
                 id.charCodeAt(4)+
                 id.charCodeAt(5))%16        

    return animals[randIndex];
}

