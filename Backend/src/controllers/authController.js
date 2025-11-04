const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, region } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Enforce farmer-only self registration
    if (role && role.toLowerCase() === "admin") {
      return res.status(403).json({
        success: false,
        message: "Only farmer accounts can be created via public registration",
      });
    }

    // Create user as farmer regardless of provided role
    const user = await User.create({
      name,
      email,
      password,
      role: "farmer",
      region,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region,
        },
        token,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Support shorthand admin login using "admin" as username
    if (
      email &&
      typeof email === "string" &&
      !email.includes("@") &&
      email.toLowerCase() === "admin"
    ) {
      email = "admin@example.com";
    }

    // Check for user
    let user = await User.findOne({ email }).select("+password");

    // If admin user doesn't exist yet, auto-bootstrap it with default password
    if (!user && email.toLowerCase() === "admin@example.com") {
      const created = await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: process.env.SEED_ADMIN_PASSWORD || "admin123",
        role: "admin",
        region: "lahore",
      });
      user = await User.findById(created._id).select("+password");
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    let isMatch = await user.comparePassword(password);

    // Fallback: allow configured admin password even if hash differs
    if (!isMatch && user.role === "admin") {
      const fallback = process.env.SEED_ADMIN_PASSWORD || "admin123";
      if (password === fallback) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Admin: no token in response. Farmer: include token
    if (user.role === "admin") {
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            region: user.region,
          },
        },
        message: "Login successful",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region,
        },
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
