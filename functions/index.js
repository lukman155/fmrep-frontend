/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// eslint-disable-next-line no-unused-vars
// const cors = require("cors")({origin: true});

// admin.initializeApp();

// exports.deleteUser = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     try {
//       const userId = req.query.userId;

//       if (!userId) {
//         return res.status(400).send("User ID is required");
//       }

//       await admin.auth().deleteUser(userId);

//       return res.status(200).send("User deleted successfully");
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       return res.status(500).send("Internal Server Error");
//     }
//   });
// });

exports.removeUser = functions.firestore.document("/users/{uid}")
    .onDelete((snapshot, context) => {
      const serviceAccount = require("./functions/ha.json");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      return admin.auth().deleteUser(context.params.uid);
    });
