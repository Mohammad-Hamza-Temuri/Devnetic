import express from 'express';
import developers from './data/developers.js';

const app = express();

app.get("/", (req, res) =>{
   res.send("Welcome to Devnetic API"); 
});

app.get("/developers/:id" , (req, res) => {

    const developerId = Number(req.params.id);

    const developer = developers.find((dev) => {
        return dev.id === developerId;
    });

    if(!developer){
        return res.status(404).json({
            message: "Developer not found"
        });
    }

    res.json(developer);

})

export default app;