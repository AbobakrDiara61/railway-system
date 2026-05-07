export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `You are not allowed to access this. Required: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

export const adminOnly = authorizeRoles("admin", "super_admin");
export const superAdminOnly = authorizeRoles("super_admin");