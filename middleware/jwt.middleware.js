import jwt from "jsonwebtoken"

// Middleware de autenticación
export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Token not provided');
    

    try {
       const {id,role} = jwt.verify(token, process.env.JWT_SECRET);
       req.user = { id, role}

       next();

    } catch (error) {
      res.status(400).send('Token no válido '+ error);
    }
  };