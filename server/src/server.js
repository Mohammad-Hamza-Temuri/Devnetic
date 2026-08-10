import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 3000;

connectDB().then(() =>{
    app.listen(PORT, () =>{
    console.log(`Devnetic Server is running on http://localhost:${PORT}`)
   });
});

