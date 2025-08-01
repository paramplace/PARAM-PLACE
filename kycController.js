const faceapi = require('face-api.js');
const canvas = require('canvas');
const { createCanvas, Image } = canvas;
const fs = require('fs');
const path = require('path');

// Configure face-api.js
faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData });
const MODEL_PATH = path.resolve(__dirname, '../../models');

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
};

loadModels();

exports.verifyFace = async (req, res) => {
  try {
    const { idImage, selfieImage } = req.body;
    
    // Convert base64 to images
    const idImg = await canvas.loadImage(idImage);
    const selfieImg = await canvas.loadImage(selfieImage);
    
    // Detect faces
    const idDetection = await faceapi.detectSingleFace(idImg)
      .withFaceLandmarks()
      .withFaceDescriptor();
      
    const selfieDetection = await faceapi.detectSingleFace(selfieImg)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!idDetection || !selfieDetection) {
      return res.status(400).json({ error: 'No faces detected' });
    }
    
    // Calculate face similarity
    const distance = faceapi.euclideanDistance(
      idDetection.descriptor,
      selfieDetection.descriptor
    );
    
    // Threshold for verification (lower is more similar)
    const verified = distance < 0.6;
    
    // Save verification result to database
    // ... database logic here
    
    res.json({ verified, distance });
    
  } catch (error) {
    console.error('KYC Error:', error);
    res.status(500).json({ error: 'Face verification failed' });
  }
};