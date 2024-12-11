const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const { title, description, category } = JSON.parse(event.body);
    const videoId = uuid.v4();
    const s3Key = `videos/${videoId}.mp4`;

    // Generate a pre-signed URL for uploading
    const uploadUrl = s3.getSignedUrl('putObject', {
        Bucket: 'video-upload-bucket',
        Key: s3Key,
        Expires: 3600,
    });

    // Save metadata in DynamoDB
    const metadata = {
        TableName: 'Videos',
        Item: {
            videoId,
            title,
            description,
            category,
            videoUrl: `https://video-upload-bucket.s3.amazonaws.com/${s3Key}`,
            uploadedAt: new Date().toISOString(),
        },
    };

    await dynamoDB.put(metadata).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ uploadUrl }),
    };
};
