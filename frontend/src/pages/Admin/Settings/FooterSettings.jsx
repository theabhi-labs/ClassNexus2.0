import { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function FooterSettings() {
  const [footer, setFooter] = useState({
    aboutText:
      "Leading Coaching Institute providing quality education for over 10 years.",
    phone: "+91 12345 67890",
    email: "info@institute.com",
    address: "Your Institute Address Here",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
    },
  });

  const handleChange = (field, value) => {
    setFooter({ ...footer, [field]: value });
  };

  const handleSocialChange = (platform, value) => {
    setFooter({
      ...footer,
      socialLinks: {
        ...footer.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleSave = () => {
    console.log("Saved Footer Settings:", footer);
    alert("Footer Settings Saved Successfully!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Footer & Contact Settings</h2>

      <div className="space-y-6">

        {/* About Us */}
        <div>
          <label className="block font-medium mb-2">About Us Text</label>
          <textarea
            rows="4"
            value={footer.aboutText}
            onChange={(e) => handleChange("aboutText", e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block font-medium mb-2">Phone Number</label>
            <input
              type="text"
              value={footer.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={footer.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium mb-2">Address</label>
          <textarea
            rows="3"
            value={footer.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 text-blue-600" />
              <input
                type="text"
                placeholder="Facebook URL"
                value={footer.socialLinks.facebook}
                onChange={(e) =>
                  handleSocialChange("facebook", e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-pink-600" />
              <input
                type="text"
                placeholder="Instagram URL"
                value={footer.socialLinks.instagram}
                onChange={(e) =>
                  handleSocialChange("instagram", e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <Twitter className="w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="Twitter URL"
                value={footer.socialLinks.twitter}
                onChange={(e) =>
                  handleSocialChange("twitter", e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <Youtube className="w-5 h-5 text-red-600" />
              <input
                type="text"
                placeholder="YouTube URL"
                value={footer.socialLinks.youtube}
                onChange={(e) =>
                  handleSocialChange("youtube", e.target.value)
                }
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}