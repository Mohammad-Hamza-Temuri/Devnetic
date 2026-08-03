const developers = [
    {
        id: 1,
        name: "Hamza"
    },
    {
        id: 2,
        name: "Ali"
    },
    {
        id: 3,
        name: "Safi"
    }
];

export const getAllDevelopersService = () =>{
    return developers;
};

export const getDeveloperByIdService = (id) =>{
    return developers.find((developer) => developer.id === id);
}