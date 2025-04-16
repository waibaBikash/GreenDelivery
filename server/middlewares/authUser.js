import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({
      success: false,
      message: "No Authorized"
    });
  }
  try {
    const tokenDeconded = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenDeconded) {
        req.body.userId = tokenDeconded.id;
      }else {
        return res.json({
          success: false,
          message: "No Authorized"
        });
      }
    next();

  } catch (error) {
    res.json({
      success: false,
      message: "No Authorized"
    });
  }
}
export default authUser;