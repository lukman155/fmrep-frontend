const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Enable CORS
const cors = require("cors")({origin: true});

exports.removeUser = functions.firestore.document("/users/{uid}")
    .onDelete((snapshot, context) => {
      const serviceAccount = require("./functions/ha.json");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      // Use CORS middleware
      return cors((req, res) => {
        // Your function logic here
        return admin.auth().deleteUser(context.params.uid)
            .then(() => res.status(200).send("User deleted successfully"))
            .catch((error) => res.status(500).send(`Error : ${error.message}`));
      // eslint-disable-next-line no-undef
      })(req, res);
    });
