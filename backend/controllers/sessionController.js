const Session = require('../models/Session');

// @desc    Save a new writing session
// @route   POST /api/sessions
// @access  Private
const saveSession = async (req, res) => {
  try {
    const { content, metadata } = req.body;

    const session = await Session.create({
      user: req.user.id,
      content,
      metadata,
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving session' });
  }
};

// @desc    Get all sessions for a user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
};

module.exports = { saveSession, getSessions };
