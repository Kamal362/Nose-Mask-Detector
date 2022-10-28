    
    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/wg-nsT7dN/";

    let model, webcam, labelContainer, maxPredictions, display;
    
    

    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ])
      .then(()=> console.log('done loading faceapi'))
      .then(loadModelUrl())
      .then(detectFace())


    // Load models and setup the webcam
    async function loadModelUrl() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        // call camera function
        await getMediaCamera()
    }

    // get media camera for input 
    async function getMediaCamera(){
      // Convenience function to setup a webcam
      const flip = true; // whether to flip the webcam
      webcam = new tmImage.Webcam(395, 395, flip); // width, height, flip
      await webcam.setup(); // request access to the webcam
      await webcam.play();
      //await detectFace()
      window.requestAnimationFrame(giveLiveUpadte);
      // detect all faces
      //console.log('about o detect faces') 
       // append elements to the DOM
      document.getElementById("webcam-container").appendChild(webcam.canvas);
      labelContainer = document.getElementById("label-container");
      for (let i = 0; i < maxPredictions; i++) { // and class labels
           labelContainer.appendChild(document.createElement("div"));
       }
    }

   
    async function giveLiveUpadte() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(giveLiveUpadte);
    }

    // calling the model function
    //loadModelUrl();
  
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }

// // detect faces    
async function detectFace(){
    console.log('about to detect faces')
    //webcam.addEventListener('play', async () => {  
       console.log('video is playing...')
       const canvas = await faceapi.createCanvasFromMedia(webcam)
       document.body.append(canvas)
       const displaySize = { width: webcam.width, height: webcam.height }
       await faceapi.matchDimensions(canvas, displaySize)
       setInterval(async () => {
         const detections = await faceapi.detectAllFaces(webcam, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
         const resizedDetections = await faceapi.resizeResults(detections, displaySize)
         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
         faceapi.draw.drawDetections(canvas, resizedDetections)
         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
         faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
         console.log('drawing face land mark....')
       }, 100)
    //})
}
 
   