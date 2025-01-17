const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const uploadToS3 = async (file) => {
  try {  
    // Ensure file is PDF 
    if (!file.mimetype.includes('pdf')) {
      throw new Error('Only PDF files are allowed');
    }

    const fileName = `resumes/${uuidv4()}-${file.originalname}`;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location; // Returns the public URL of the uploaded file
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

const deleteFromS3 = async (fileUrl) => {
  try {
    const key = fileUrl.split('/').pop(); // Extract file name from URL
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `resumes/${key}`
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

module.exports = { uploadToS3, deleteFromS3 }; 