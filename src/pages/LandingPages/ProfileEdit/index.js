import axios from "axios";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import Select from "react-select";

function ProfileEdit() {
  const [profileData, setProfileData] = useState({
    fullName: "",
    address: "",
    addressTwo: "",
    city: "",
    state: "", // Prepopulate from userprofile table
    zipCode: "",
    skills: [],
    preferences: [],
    availability: "",
  });

  const [states, setStates] = useState([]); // Dropdown options for states
  const [loading, setLoading] = useState(true);

  // Custom styles for the Select component
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: "16px",
      fontWeight: "400",
      color: "#7B809A", // Matches input field label color
      border: "1px solid #D1D1D1",
      boxShadow: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "16px",
      color: "#7B809A",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "16px",
      color: "#000", // Text color for the selected value
    }),
  };

  // Fetch profile and state data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          withCredentials: true,
        });

        const data = response.data;

        setProfileData({
          ...data,
          skills: Array.isArray(data.skills) ? data.skills : JSON.parse(data.skills || "[]"), // Ensure skills is an array
          preferences: Array.isArray(data.preferences)
            ? data.preferences
            : JSON.parse(data.preferences || "[]"), // Ensure preferences is an array
          availability:
            typeof data.availability === "string" && data.availability.includes("-")
              ? data.availability // Keep availability as a valid string
              : "", // Default to empty string if not set
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error.response?.data || error.message);
        setLoading(false);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/states"); // Fetch states from states table
        setStates(
          response.data.map((state) => ({
            value: state.stateCode,
            label: state.stateName,
          }))
        );
      } catch (error) {
        console.error("Error fetching states:", error.response?.data || error.message);
      }
    };

    fetchProfileData();
    fetchStates();
  }, []);

  const handleChange = (field) => (event) => {
    setProfileData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleDateChange = (dates) => {
    if (Array.isArray(dates) && dates.length === 2) {
      // Ensure dates are converted to valid Date objects
      const [startDate, endDate] = dates.map((date) => new Date(date));
      const formattedRange = `${startDate.toLocaleDateString("en-US")}-${endDate.toLocaleDateString(
        "en-US"
      )}`;
      setProfileData((prev) => ({ ...prev, availability: formattedRange }));
    }
  };

  const handleStateChange = (selectedOption) => {
    setProfileData((prev) => ({ ...prev, state: selectedOption.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/profile", profileData, {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <MKBox display="flex" justifyContent="center" alignItems="center" height="100vh">
        <MKTypography variant="h6">Loading...</MKTypography>
      </MKBox>
    );
  }

  return (
    <MKBox
      bgColor="white"
      borderRadius="xl"
      shadow="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      p={3}
      mx={10}
      mt={5}
    >
      <MKTypography variant="h4" fontWeight="bold" mb={3}>
        Edit Profile
      </MKTypography>

      <MKBox component="form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            Full Name
          </MKTypography>
          <MKInput
            type="text"
            fullWidth
            value={profileData.fullName}
            onChange={handleChange("fullName")}
          />
        </MKBox>
        {/* Address */}
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            Address
          </MKTypography>
          <MKInput
            type="text"
            fullWidth
            value={profileData.address}
            onChange={handleChange("address")}
          />
        </MKBox>
        {/* Address Line 2 */}
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            Address Line 2
          </MKTypography>
          <MKInput
            type="text"
            fullWidth
            value={profileData.addressTwo}
            onChange={handleChange("addressTwo")}
          />
        </MKBox>
        {/* City */}
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            City
          </MKTypography>
          <MKInput type="text" fullWidth value={profileData.city} onChange={handleChange("city")} />
        </MKBox>
        {/* State Dropdown */}
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            State
          </MKTypography>
          <Select
            options={states}
            value={states.find((s) => s.value === profileData.state)} // Prepopulate from userprofile
            onChange={handleStateChange}
            placeholder="Select State"
            styles={customSelectStyles}
          />
        </MKBox>
        {/* ZIP Code */}
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            ZIP Code
          </MKTypography>
          <MKInput
            type="text"
            fullWidth
            value={profileData.zipCode}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numbers and restrict to 5 characters
              if (/^\d{0,5}$/.test(value)) {
                setProfileData((prev) => ({ ...prev, zipCode: value }));
              }
            }}
          />
        </MKBox>
        {/* Skills */}
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            Skills
          </MKTypography>
          <Select
            isMulti
            options={[
              { value: "Event Planning", label: "Event Planning" },
              { value: "Fundraising", label: "Fundraising" },
              { value: "Mentorship", label: "Mentorship" },
              { value: "Administrative Support", label: "Administrative Support" },
              { value: "First Aid", label: "First Aid" },
              { value: "Teaching", label: "Teaching" },
              { value: "Cooking", label: "Cooking" },
              { value: "Gardening", label: "Gardening" },
              { value: "Building", label: "Building" },
            ]}
            value={profileData.skills.map((skill) => ({ value: skill, label: skill }))}
            onChange={(selected) =>
              setProfileData((prev) => ({ ...prev, skills: selected.map((s) => s.value) }))
            }
            placeholder="Select Skills"
            styles={customSelectStyles}
          />
        </MKBox>
        {/* Preferences */}
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            Preferences
          </MKTypography>
          <Select
            isMulti
            options={[
              { value: "Weekends", label: "Weekends" },
              { value: "Weekdays", label: "Weekdays" },
              { value: "Remote", label: "Remote" },
              { value: "Evenings", label: "Evenings" },
              { value: "On-site", label: "On-site" },
            ]}
            value={profileData.preferences.map((pref) => ({ value: pref, label: pref }))}
            onChange={(selected) =>
              setProfileData((prev) => ({ ...prev, preferences: selected.map((p) => p.value) }))
            }
            placeholder="Select Preferences"
            styles={customSelectStyles} // Reuse the same styles as Skills
          />
        </MKBox>
        <MKBox mb={2}>
          <MKTypography variant="body2" color="text">
            Availability
          </MKTypography>
          <DatePicker
            range
            value={
              typeof profileData.availability === "string" && profileData.availability.includes("-")
                ? profileData.availability.split("-").map((date) => new Date(date))
                : [] // Default to an empty array if not properly set
            }
            onChange={handleDateChange}
            format="MM/DD/YYYY"
          />
        </MKBox>
        {/* Submit Button */}
        <MKBox mt={3} textAlign="center">
          <MKButton type="submit" variant="gradient" color="info">
            Save Changes
          </MKButton>
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

export default ProfileEdit;
