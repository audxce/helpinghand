const express = require("express");
const router = express.Router();
const db = require("../db"); // Adjust this if your database file is elsewhere

function isValidJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

router.get("/volunteer", async (req, res) => {
  const query = `
    SELECT userprofile.* 
    FROM userprofile
    JOIN usercredentials ON userprofile.user_id = usercredentials.user_id
    WHERE usercredentials.role = 'volunteer'
  `;

  try {
    const [results] = await db.query(query);

    if (results.length === 0) {
      return res.status(404).json({ message: "No volunteer users found" });
    }

    const users = results.map((user) => ({
      fullName: user.full_name,
      address: user.address,
      addressTwo: user.address_two,
      city: user.city,
      zipCode: user.zipcode,
      state: user.state,
      skills: user.skills,
      preferences: user.preferences,
      availability: user.availability,
    }));

    //console.log(users);
    res.json(users);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

router.get("/admin", async (req, res) => {
  const query = `
    SELECT userprofile.* 
    FROM userprofile
    JOIN usercredentials ON userprofile.user_id = usercredentials.user_id
    WHERE usercredentials.role = 'administrator'
  `;

  try {
    const [results] = await db.query(query);

    if (results.length === 0) {
      return res.status(404).json({ message: "No administrator users found" });
    }

    const users = results.map((user) => ({
      fullName: user.full_name,
      address: user.address,
      addressTwo: user.address_two,
      city: user.city,
      zipCode: user.zipcode,
      state: user.state,
      skills: user.skills,
      preferences: user.preferences,
      availability: user.availability,
    }));

   // console.log(users);
    res.json(users);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Get user profile
router.get("/", async (req, res) => {
  const userId = req.session?.user?.id; // Retrieve user ID from session
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const [results] = await db.query("SELECT * FROM UserProfile WHERE user_id = ?", [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    res.json({
      fullName: user.full_name,
      address: user.address,
      addressTwo: user.address_two || "",
      city: user.city,
      state: user.state,
      zipCode: user.zipcode,
      skills: isValidJson(user.skills),
      preferences: isValidJson(user.preferences),
      availability: isValidJson(user.availability),
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Update user profile
router.post("/", async (req, res) => {
  const userId = req.session?.user?.id; // Retrieve user ID from session
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const { fullName, address, addressTwo, city, state, zipCode, skills, preferences, availability } =
    req.body;

  if (!fullName) {
    return res.status(400).json({ message: "Full name is required" });
  }

  const profileData = {
    user_id: userId,
    full_name: fullName,
    address,
    address_two: addressTwo,
    city,
    state,
    zipcode: zipCode,
    skills: JSON.stringify(skills),
    preferences: JSON.stringify(preferences),
    availability: JSON.stringify(availability),
  };

  try {
    const [existingProfile] = await db.query("SELECT * FROM UserProfile WHERE user_id = ?", [
      userId,
    ]);
    if (existingProfile.length > 0) {
      await db.query("UPDATE UserProfile SET ? WHERE user_id = ?", [profileData, userId]);
      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      await db.query("INSERT INTO UserProfile SET ?", profileData);
      res.status(201).json({ message: "Profile created successfully" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error saving profile" });
  }
});

module.exports = router;
