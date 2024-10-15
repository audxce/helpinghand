import { useState } from "react";

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

function ProfileEdit() {
  const [dropdown, setDropdown] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const openDropdown = ({ currentTarget }) => setDropdown(currentTarget);
  const closeDropdown = () => setDropdown(null);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    closeDropdown();
  };

  //cal
  const [values, setValues] = useState([new Date()]);
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

  const [inputs, setInputs] = useState({
    fullName: { value: "", isSuccess: false },
    address: { value: "", isSuccess: false },
    city: { value: "", isSuccess: false },
    zipCode: { value: "", isSuccess: false },
  });

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    const isSuccess = value.length > 0; // Customize your success condition

    setInputs((prev) => ({
      ...prev,
      [field]: { value, isSuccess },
    }));
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
      mx={80}
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
              success={inputs.fullName.isSuccess}
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
                success={inputs.address.isSuccess}
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
                  placeholder="eg. 4302 University Dr, Houston, TX 77004"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
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
                    placeholder="eg. Houston"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
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
                        <MenuItem onClick={() => handleStateSelect("AL")}>AL</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("AK")}>AK</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("AZ")}>AZ</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("AR")}>AR</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("CA")}>CA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("CO")}>CO</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("CT")}>CT</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("DE")}>DE</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("FL")}>FL</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("GA")}>GA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("HI")}>HI</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("ID")}>ID</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("IL")}>IL</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("IN")}>IN</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("IA")}>IA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("KS")}>KS</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("KY")}>KY</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("LA")}>LA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("ME")}>ME</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MD")}>MD</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MA")}>MA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MI")}>MI</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MN")}>MN</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MS")}>MS</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MO")}>MO</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MT")}>MT</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NE")}>NE</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NV")}>NV</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NH")}>NH</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NJ")}>NJ</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NM")}>NM</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NY")}>NY</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NC")}>NC</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("ND")}>ND</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("OH")}>OH</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("OK")}>OK</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("OR")}>OR</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("PA")}>PA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("RI")}>RI</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("SC")}>SC</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("SD")}>SD</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("TN")}>TN</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("TX")}>TX</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("UT")}>UT</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("VT")}>VT</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("VA")}>VA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("WA")}>WA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("WV")}>WV</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("WI")}>WI</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("WY")}>WY</MenuItem>
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
                        success={inputs.zipCode.isSuccess}
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
                            rows={6}
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
                            <DatePicker value={values} onChange={setValues} multiple range />
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
                              <MKButton variant="gradient" color="success">
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
