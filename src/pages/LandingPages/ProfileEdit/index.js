import { useState, useEffect } from "react";

//multi-dropdown
import Select from "react-select";

//calender
import DatePicker from "react-multi-date-picker";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";

import bgImage from "assets/images/hh-bg.jpg";

import axios from "axios";

function ProfileEdit() {
  const [states, setStates] = useState([]);

  const [dropdown, setDropdown] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState("");

  const [inputs, setInputs] = useState({
    fullName: { value: "", isSuccess: false, isFail: false },
    address: { value: "", isSuccess: false, isFail: false },
    addressTwo: { value: "", isSuccess: false, isFail: false },
    city: { value: "", isSuccess: false, isFail: false },
    zipCode: { value: "", isSuccess: false, isFail: false },
  });

  //cal
  const [values, setValues] = useState([]);
  const openDropdown = ({ currentTarget }) => setDropdown(currentTarget);
  const closeDropdown = () => setDropdown(null);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    closeDropdown();
  };

  //multi-dropdown
  const options = [
    { value: "cooking", label: "Cooking" },
    { value: "gardening", label: "Gardening" },
    { value: "Building", label: "building" },
  ];

  // Styles
  const iconStyles = {
    ml: 1,
    fontWeight: "bold",
    transition: "transform 200ms ease-in-out",
  };

  const dropdownIconStyles = {
    transform: dropdown ? "rotate(180deg)" : "rotate(0)",
    ...iconStyles,
  };

  //const [fullName, setFullName] = useState('');

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    const isSuccess = value.length > 0;
    const fail = false;

    setInputs((prev) => ({
      ...prev,
      [field]: { value, isSuccess, fail },
    }));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const parseDates = (formattedDates) => {
    if (!formattedDates || !Array.isArray(formattedDates)) {
      return [];
    }

    return formattedDates.map((dateStr) => {
      // If the dateStr contains a range ("2023/11/15 - 2023/11/20")
      if (dateStr.includes(" - ")) {
        const range = dateStr.split(" - ").map((date) => new Date(date));
        return range;
      }

      // If it a single date (e.g., "2023/11/15")
      return new Date(dateStr);
    });
  };

  const formatDates = (dates) => {
    if (!Array.isArray(dates) || dates.length === 0) {
      return "";
    }
    const formattedDates = [];
    for (const date of dates) {
      let forDate = "";
      if (date.length == 1) {
        forDate += formatDate(new Date(date[0]));
        formattedDates.push(forDate);
        break;
      }
      for (let i = 0; i < date.length; i++) {
        forDate += formatDate(new Date(date[i]));
        if (i != date.length - 1) {
          forDate += " - ";
        }
      }
      formattedDates.push(forDate);
    }

    return formattedDates;
  };

  useEffect(() => {
    const userId = 1;
    axios
      .get(`http://localhost:5000/api/profileEdit/profile/${userId}`)
      .then((response) => {
        const userData = response.data;
        setInputs({
          fullName: { value: userData.fullName, isSuccess: true, isFail: false },
          address: { value: userData.address, isSuccess: true, isFail: false },
          addressTwo: { value: userData.addressTwo || "", isSuccess: true, isFail: false },
          city: { value: userData.city, isSuccess: true, isFail: false },
          zipCode: { value: userData.zipCode, isSuccess: true, isFail: false },
        });
        setSelectedState(userData.state);
        setSkills(userData.skills.map((skill) => ({ value: skill, label: skill })));
        setPreferences(userData.preferences);
        setValues(parseDates(userData.availability || []));
      })
      .catch((error) => {
        console.error("Errfetching profile data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/states")
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error("Errr fetching states:", error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    //console.log("test:", values);
    const formattedAvailability = formatDates(values);

    const dataToSend = {
      fullName: inputs.fullName.value,
      address: inputs.address.value,
      addressTwo: inputs.addressTwo.value,
      city: inputs.city.value,
      state: selectedState,
      zipCode: inputs.zipCode.value,
      skills: skills.map((skill) => skill.value),
      preferences: preferences,
      availability: formattedAvailability,
    };
    console.log("Data:", dataToSend);
    try {
      const response = await axios.post("http://localhost:5000/api/profileData", dataToSend);
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message);

      if (error.response?.data?.message == "Invalid zip code format") {
        setInputs((prev) => ({
          ...prev,
          zipCode: { ...prev.zipCode, isSuccess: false, isFail: true },
        }));
      }
      if (error.response?.data?.message == "All fields are required") {
        for (const key in inputs) {
          if (!inputs[key].value) {
            setInputs((prev) => ({
              ...prev,
              [key]: {
                ...prev[key],
                isSuccess: false,
                isFail: true,
              },
            }));
          }
        }
      }
    }
  };

  return (
    <MKBox
      bgColor="white"
      borderRadius="xl"
      shadow="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      mt={{ xs: 20, sm: 18, md: 20 }}
      mb={{ xs: 20, sm: 18, md: 20 }}
      mx={70}
    >
      <MKBox component="section" py={5}>
        <Container>
          <Grid container item xs={12} lg={8} py={1} mx="auto" style={{ marginTop: "10px" }}>
            <MKInput
              variant="standard"
              label="Full Name*"
              placeholder="eg. Raj Singh"
              InputLabelProps={{ shrink: true }}
              fullWidth
              inputProps={{ maxLength: 50 }}
              onChange={handleChange("fullName")}
              error={inputs.fullName.isFail}
              success={inputs.fullName.isSuccess}
              value={inputs.fullName.value}
            />
          </Grid>
        </Container>
        <MKBox component="section" py={5}>
          <Container>
            <Grid container item xs={12} lg={8} py={1} mx="auto">
              <MKInput
                maxLength={2}
                variant="standard"
                label="Address 1*"
                inputProps={{ maxLength: 100 }}
                placeholder="eg. 4302 University Dr, Houston, TX 77004"
                InputLabelProps={{ shrink: true }}
                fullWidth
                onChange={handleChange("address")}
                error={inputs.address.isFail}
                success={inputs.address.isSuccess}
                value={inputs.address.value}
              />
            </Grid>
          </Container>
          <MKBox component="section" py={5}>
            <Container>
              <Grid container item xs={12} lg={8} py={1} mx="auto">
                <MKInput
                  variant="standard"
                  label="Address 2"
                  inputProps={{ maxLength: 100 }}
                  onChange={handleChange("addressTwo")}
                  placeholder="eg. 4302 University Dr, Houston, TX 77004"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={inputs.addressTwo.value}
                />
              </Grid>
            </Container>
            <MKBox component="section" py={5}>
              <Container>
                <Grid container item xs={12} lg={8} py={1} mx="auto">
                  <MKInput
                    variant="standard"
                    label="City*"
                    inputProps={{ maxLength: 100 }}
                    onChange={handleChange("city")}
                    success={inputs.city.isSuccess}
                    error={inputs.city.isFail}
                    placeholder="eg. Houston"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={inputs.city.value}
                  />
                </Grid>
              </Container>
              <MKBox component="section" py={5}>
                <Container>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={12} textAlign="center">
                      <MKButton variant="gradient" color="info" onClick={openDropdown}>
                        {selectedState ? selectedState : "State*"}
                        <Icon sx={dropdownIconStyles}>expand_more</Icon>
                      </MKButton>
                      <Menu anchorEl={dropdown} open={Boolean(dropdown)} onClose={closeDropdown}>
                        {states.map((state) => (
                          <MenuItem
                            key={state.stateCode}
                            onClick={() => handleStateSelect(state.stateCode)}
                          >
                            {state.stateCode}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Grid>
                  </Grid>
                </Container>
                <MKBox component="section" py={3}>
                  <Container>
                    <Grid container item xs={12} lg={8} py={1} mx="auto">
                      <MKInput
                        type="number"
                        variant="standard"
                        label="Zip code*"
                        placeholder="eg. 77004"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        onChange={handleChange("zipCode")}
                        onInput={(e) => {
                          if (e.target.value.length > 9) {
                            e.target.value = e.target.value.slice(0, 9);
                          }
                        }}
                        error={inputs.zipCode.isFail}
                        success={inputs.zipCode.isSuccess}
                        value={inputs.zipCode.value}
                      />
                    </Grid>
                  </Container>
                  <MKBox component="section" py={3}>
                    <Container>
                      <Grid container item xs={12} lg={8} py={1} mx="auto">
                        <Grid item xs={12} sm={10}>
                          <MKTypography variant="h6" color="gray" fontsize="5">
                            Skills*
                          </MKTypography>
                        </Grid>
                        <Select
                          //defaultValue={[colourOptions[2], colourOptions[3]]}
                          isMulti
                          name="colors"
                          options={options}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={setSkills}
                          value={skills}
                        />
                      </Grid>
                    </Container>
                    <MKBox component="section" py={3}>
                      <Container>
                        <Grid container item xs={12} lg={8} py={1} mx="auto">
                          <MKInput
                            variant="standard"
                            label="Preferences"
                            placeholder="Message"
                            multiline
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            onChange={(event) => setPreferences(event.target.value)}
                            rows={6}
                            value={preferences}
                          />
                        </Grid>
                      </Container>
                      <MKBox component="section" py={3}>
                        <Container>
                          <Grid container item xs={12} lg={4} py={1} mx="auto">
                            <Grid item xs={12} sm={10}>
                              <MKTypography variant="h6" color="gray" fontsize="5">
                                Availability*
                              </MKTypography>
                            </Grid>
                            <DatePicker
                              onChange={setValues}
                              multiple
                              range
                              format="MM/DD/YYYY"
                              value={values}
                            />
                          </Grid>
                        </Container>
                        <MKBox
                          position="absolute"
                          top={0}
                          left={0}
                          zIndex={-1}
                          width="100%"
                          minHeight="200vh"
                          sx={{
                            backgroundImage: `url(${bgImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "repeat",
                          }}
                        />
                        <MKBox component="section" py={3}>
                          <Container>
                            <Grid container item xs={12} lg={2.7} py={1} mx="auto">
                              <MKButton variant="gradient" color="success" onClick={handleSubmit}>
                                Save Changes
                              </MKButton>
                            </Grid>
                          </Container>
                        </MKBox>
                      </MKBox>
                    </MKBox>
                  </MKBox>
                </MKBox>
              </MKBox>
            </MKBox>
          </MKBox>
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

export default ProfileEdit;
