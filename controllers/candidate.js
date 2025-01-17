const Candidate = require('../models/Candidate');
const { uploadToS3, deleteFromS3 } = require('../utils/s3Upload');
const logger = require('../utils/logger');
const multer = require('multer');
const upload = multer().single('resume');

// Create new candidate
const createCandidate = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload error'
        });
      }

      // Validate required fields
      const { name, jobTitle, email, phoneNumber } = req.body;
      if (!name || !jobTitle || !email || !phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: name, jobTitle, email, phoneNumber'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Resume file is required'
        });
      }

      const resumeUrl = await uploadToS3(req.file);
      
      const candidate = new Candidate({
        name,
        jobTitle,
        email,
        phoneNumber,
        state: req.body.state || 'pending', // Optional field with default
        resumeUrl,
        addedBy: req.user._id // This comes from the auth middleware
      });

      await candidate.save();

      res.status(201).json({
        success: true,
        data: candidate
      });
    });
  } catch (error) {
    console.log('Error in createCandidate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get all candidates for a user
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ addedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: candidates
    });
  } catch (error) {
    logger.error('Error in getCandidates:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Update candidate
const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Handle resume update if new file is provided
    if (req.file) {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'File upload error'
          });
        }

        const candidate = await Candidate.findById(id);
        if (candidate.resumeUrl) {
          await deleteFromS3(candidate.resumeUrl);
        }

        updateData.resumeUrl = await uploadToS3(req.file);
      });
    }

    const candidate = await Candidate.findOneAndUpdate(
      { _id: id, addedBy: req.user._id },
      updateData,
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    logger.error('Error in updateCandidate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = await Candidate.findOne({ 
      _id: id, 
      addedBy: req.user._id 
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Delete resume from S3
    if (candidate.resumeUrl) {
      await deleteFromS3(candidate.resumeUrl);
    }

    await candidate.remove();

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    logger.error('Error in deleteCandidate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

module.exports = {
  createCandidate,
  getCandidates,
  updateCandidate,
  deleteCandidate
}; 