import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

function ProfileEdit() {
  const [dropdown, setDropdown] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const openDropdown = ({ currentTarget }) => setDropdown(currentTarget);
  const closeDropdown = () => setDropdown(null);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    closeDropdown();
  };

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

  return (
    <MKBox component="section" py={5}>
      <Container>
        <Grid container item xs={12} lg={4} py={1} mx="auto" style={{ marginTop: "10px" }}>
          <MKInput
            variant="standard"
            label="Full Name"
            placeholder="eg. Raj Singh"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
      </Container>
      <MKBox component="section" py={5}>
        <Container>
          <Grid container item xs={12} lg={4} py={1} mx="auto">
            <MKInput
              variant="standard"
              label="Address 1"
              placeholder="eg. 4302 University Dr, Houston, TX 77004"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
        </Container>
        <MKBox component="section" py={5}>
          <Container>
            <Grid container item xs={12} lg={4} py={1} mx="auto">
              <MKInput
                variant="standard"
                label="Address 2"
                placeholder="eg. 4302 University Dr, Houston, TX 77004"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Container>
          <MKBox component="section" py={5}>
            <Container>
              <Grid container item xs={12} lg={4} py={1} mx="auto">
                <MKInput
                  variant="standard"
                  label="City"
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
                      {selectedState ? selectedState : "States"}
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
              <MKBox component="section" py={5}>
                <Container>
                  <Grid container item xs={12} lg={4} py={1} mx="auto">
                    <MKInput
                      variant="standard"
                      label="Zip code"
                      placeholder="eg. 77004"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                </Container>
              </MKBox>
            </MKBox>
          </MKBox>
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

export default ProfileEdit;
