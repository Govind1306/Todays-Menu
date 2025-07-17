const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // ✅ correct for node-fetch v2

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "TodaysMenuApp/1.0 (contact@govindmenu.in)", // ✅ required
          "Accept-Language": "en", // ✅ optional
        },
      }
    );

    if (!response.ok) {
      const text = await response.text(); // helpful to debug
      console.error("Nominatim Error Response:", text);
      throw new Error("Nominatim API failed");
    }

    const data = await response.json();

    res.json({
      city:
        data.address.city || data.address.town || data.address.village || "",
      pincode: data.address.postcode || "",
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Failed to fetch location data" });
  }
});

module.exports = router;
