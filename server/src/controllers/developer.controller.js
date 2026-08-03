import { getAllDevelopersService, getDeveloperByIdService } from "../services/developer.service.js";

export const getAllDevelopers = (req, res) =>{
    const developers = getAllDevelopersService();
    res.json(developers);
};

export const getDeveloperById = (req, res) =>{
    const developerId = Number(req.params.id);
    const developer = getDeveloperByIdService(developerId);

    if(!developer) {
        return res.status(404).json({
            message: "Developer not found"
        });
    }
    res.json(developer)
}