const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
  };
};

export default roleMiddleware;