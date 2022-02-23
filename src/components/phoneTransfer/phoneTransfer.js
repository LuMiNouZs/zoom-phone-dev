import { useState, useEffect } from "react";
import "./phoneTransfer.css";
import { Container, Button } from "react-bootstrap";

import { httpClient } from "./../../utils/HttpClient";
import { server } from "../../constants";
import { FcSynchronize } from "react-icons/fc";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

import { useLocation, useNavigate } from "react-router-dom";
const initialState = [];

const PhoneTransfer = (props) => {
  const location = useLocation();

  const [profileId, setProfileId] = useState(
    localStorage.getItem(server.PROFILE_ID)
  );
  const [zoomPhoneNumber, setZoomPhoneNumber] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectRequestNumber, setSelectRequestNumber] = useState([]);

  const [selectAvailableNumber, setSelectAvailableNumber] = useState([]);
  const [selectAlreadyNumber, setSelectAlreadyNumber] = useState([]);

  const [buttonRequestDisable, setButtonRequestDisable] = useState(true);
  const [buttonReturnDisable, setButtonReturnDisable] = useState(true);

  const [oneSelect, setOneSelect] = useState([]);
  const [oneUnSelect, setOneUnSelect] = useState([]);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(server.ACCESS_TOKEN)
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem(server.REFRESH_TOKEN)
  );

  const [data, setData] = useState({
    phone_numbers: [
      {
        status: 1,
        phone_number: "66033049865",
        sip_trunk_name: "PEX_1TAL_01_RL",
        service_info: "Port Completed",
        billing_reference_id: "1toall1234",
      },
    ],
    carrier_code: 5015,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPhoneNumber();
    ferchZoomPhoneExchange(profileId);
  }, []);

  const addPeeringNumber = () => {
    httpClient
      .post(server.PEERING_NUMBER_URL, {
        accessToken: accessToken,
        phoneNumber: oneSelect[0].phoneNumber,
      })
      .then((result) => {
        console.log(result);
        if (result.data.unprocessed_numbers.length === 0) {
          console.log(result.data);
          submitAddZoomPhoneDB({
            userId: profileId,
            phoneNumberId: oneSelect[0].uuid,
          });
        } else {
          console.log("Can't add : " + result.data.unprocessed_numbers);
          alert(
            "Warning : Can't add peering phonenumber, \n " +
              JSON.stringify(result.data.unprocessed_numbers)
          );
        }
      })
      .catch((err) => {
        alert(JSON.stringify(err.message));
      });
  };

  const deletePeeringNumber = () => {
    httpClient
      .delete(server.PEERING_NUMBER_URL, {
        data: {
          accessToken: accessToken,
          phoneNumber: oneUnSelect[0].phoneNumber,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.data.unprocessed_numbers.length === 0) {
          console.log(result.data);
          submitRemoveZoomPhoneDB({
            userId: profileId,
            phoneNumberId: oneUnSelect[0].uuid,
          });
        } else {
          //console.log("can't Delete :" + result.data);
          alert(
            "Warning : Can't delete peering phonenumber, \n " +
              JSON.stringify(result.data.unprocessed_numbers)
          );
        }
      })
      .catch((err) => {
        alert(JSON.stringify(err.message));
      });
  };

  const fetchPhoneNumber = () => {
    httpClient
      .get(server.PHONETRANSFER_URL)
      .then((result) => {
        // console.log(result);
        if (result) {
          const phoneList = result.data.data;
          setPhoneNumbers(phoneList);
          //console.log(phoneNumbers);
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        alert(JSON.stringify(err));
      });
  };

  const ferchZoomPhoneExchange = (userId) => {
    httpClient
      .get(server.ZOOMEXCHANGE_URL + "/userId/" + profileId)
      .then((result) => {
        // console.log(result);
        if (result) {
          const phoneList = result.data.data;
          setZoomPhoneNumber(phoneList);
          setSelectRequestNumber(
            phoneList.map((phoneNumber) => {
              return {
                uuid: phoneNumber.phoneNumberId,
                phoneNumber: phoneNumber.phoneNumber,
              };
            })
          );
          console.log(selectRequestNumber);
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        alert(JSON.stringify(err));
      });
  };

  const submitAddZoomPhoneDB = (dataSubmit) => {
    httpClient
      .put(server.PHONETRANSFER_URL + "/addPeeringDB", dataSubmit)
      .then((result) => {
        // console.log(result);
        if (result.data.status) {
          let statusExchange = result.data.status;
          console.log(statusExchange);
          //console.log(result.data);
          alert("Add peering number " + oneSelect.phoneNumber + " successful.");
          location.reload();
        } else {
          //console.log(result.data);
          alert(
            "Warning : Can't process this phonenumber, Please contact administrator."
          );
        }
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  };

  const submitRemoveZoomPhoneDB = (dataSubmit) => {
    httpClient
      .delete(server.PHONETRANSFER_URL + "/removePeeringDB", { data : dataSubmit})
      .then((result) => {
        // console.log(result);
        if (result.data.status) {
          let statusExchange = result.data.status;
          console.log(statusExchange);
          alert("Remove peering number " + oneUnSelect.phoneNumber + " successful.");
          location.reload();
        } else {
          //console.log(result.data);
          alert(
            "Warning : Can't process this phonenumber, Please contact administrator."
          );
        }
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  };

  const requestNumberElements = selectRequestNumber.map((phoneNumber) => {
    return (
      <option
        key={phoneNumber.uuid}
        value={phoneNumber.uuid}
        label={phoneNumber.phoneNumber}
      ></option>
    );
  });

  const phonenumberElements = phoneNumbers.map((phoneNumber) => {
    // console.log(phoneNumber);
    return (
      <option
        key={phoneNumber.uuid}
        value={phoneNumber.uuid}
        label={phoneNumber.phoneNumber}
      ></option>
    );
  });

  //Clear request and fetch data avaliable again
  const refreshData = (e) => {
    console.log("Refresh!!!");
    setPhoneNumbers([]);
    setSelectAvailableNumber([]);
    setSelectRequestNumber([]);
    setSelectAlreadyNumber([]);
    setButtonRequestDisable(true);
    setButtonReturnDisable(true);
    fetchPhoneNumber();
    ferchZoomPhoneExchange(profileId);
  };

  const requestNumber = (e) => {
    console.log("Request!!!!");

    setSelectRequestNumber((prevState) => [
      ...prevState,
      ...selectAvailableNumber,
    ]);
    finalCompareRequest(selectAvailableNumber, phoneNumbers);
    setSelectAlreadyNumber(selectRequestNumber);
    setSelectAvailableNumber([]);
    setButtonRequestDisable(true);
  };

  const returnNumber = (e) => {
    console.log("Return!!!!");

    setPhoneNumbers((prevState) => [...prevState, ...selectAlreadyNumber]);
    finalCompareReturn(selectAlreadyNumber, selectRequestNumber);
    setSelectAvailableNumber(phoneNumbers);
    setSelectAlreadyNumber([]);
    setButtonReturnDisable(true);
  };

  //Request all data avaliable
  const requestAllNumber = (e) => {
    console.log("RequestAll!!!!");
    setSelectRequestNumber([]);
    setSelectAvailableNumber(phoneNumbers);
    setSelectRequestNumber(phoneNumbers);
    setPhoneNumbers([]);
  };

  //Return All data already
  const returnAllNumber = (e) => {
    console.log("Return All!!!!");
    setSelectAlreadyNumber([]);
    setPhoneNumbers(selectRequestNumber);
    setSelectAlreadyNumber(selectRequestNumber);
    setSelectRequestNumber([]);
  };

  //send API to Zoom

  const sendPeeringNumber = () => {
    if (oneSelect.length > 1 || oneUnSelect.length > 1) {
      alert("Please Select only 1 Number");
    } else {
      if (oneUnSelect.length === 1) {
        console.log("oneUnSelect : " + oneUnSelect[0].phoneNumber);
        deletePeeringNumber();
      }

      if (oneSelect.length === 1) {
        console.log("oneSelect : " + oneSelect[0].phoneNumber);
        addPeeringNumber();
      }
    }
  };

  const clickSubmit = (e) => {
    console.log("Submit!!!!");
    sendPeeringNumber();
    // submitZoomPhone({ userId: profileId, phoneNumberId: oneSelect[0].uuid });
    //submitZoomPhone({ userId: "2e11f9bb-54d2-4e2b-88ec-46ce71888179", phoneNumberId: "5e994113-6fc5-11ec-80a6-005056b11d7d" });
    // e.preventDefault();
    // console.log("Ok")
    e.preventDefault();
  };

  const onSelectAvaliable = (e) => {
    setSelectAvailableNumber(
      Array.from(e.target.selectedOptions, (option) => ({
        uuid: option.value,
        phoneNumber: option.label,
      }))
    );
    setOneSelect(
      Array.from(e.target.selectedOptions, (option) => ({
        uuid: option.value,
        phoneNumber: option.label,
      }))
    );
    //Select Left
    setOneUnSelect([]);
    setButtonRequestDisable(false);
    setButtonReturnDisable(true);
  };

  const onSelectRequest = (e) => {
    setSelectAlreadyNumber(
      Array.from(e.target.selectedOptions, (option) => ({
        uuid: option.value,
        phoneNumber: option.label,
      }))
    );
    setOneUnSelect(
      Array.from(e.target.selectedOptions, (option) => ({
        uuid: option.value,
        phoneNumber: option.label,
      }))
    );
    //Select Right
    setOneSelect([]);
    setButtonRequestDisable(true);
    setButtonReturnDisable(false);
  };

  const checkSameNumber = (selectPhoneNumber, phoneNumber) =>
    selectPhoneNumber.uuid === phoneNumber.uuid &&
    selectPhoneNumber.phoneNumber === phoneNumber.phoneNumber;

  const onlyInLeft = (left, right, compareFunction) =>
    left.filter(
      (leftValue) =>
        !right.some((rightValue) => compareFunction(leftValue, rightValue))
    );

  const finalCompareRequest = (selectPhoneNumber, phoneNumber) => {
    const onlyInA = onlyInLeft(selectPhoneNumber, phoneNumber, checkSameNumber);
    const onlyInB = onlyInLeft(phoneNumber, selectPhoneNumber, checkSameNumber);

    setPhoneNumbers([...onlyInA, ...onlyInB]);
  };

  const finalCompareReturn = (selectPhoneNumber, phoneNumber) => {
    const onlyInA = onlyInLeft(selectPhoneNumber, phoneNumber, checkSameNumber);
    const onlyInB = onlyInLeft(phoneNumber, selectPhoneNumber, checkSameNumber);

    setSelectRequestNumber([...onlyInA, ...onlyInB]);
  };

  return (
    <div className="phone-transfer">
      <Container className="container-fluid">
        <div className="p-3">
          <h4>Zoom Phone Transfer Provider Exchange</h4>
        </div>
        <div className="px-3">
          <h5>OAuth for {localStorage.getItem(server.PROFILE_NAME)} </h5>
        </div>
        <div className="row">
          <div className="col-5">
            <div className="m-3">
              <div className="text-center">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Phone No. on Zoom
                </label>
              </div>
              <select
                className="form-select"
                multiple
                size={10}
                onChange={onSelectRequest}
              >
                {requestNumberElements}
              </select>
            </div>
          </div>
          <div className="col-2">
            <div className="text-center mt-3">
              <label htmlFor="exampleFormControlTool" className="form-label">
                Tool
              </label>
              <div className="d-grid gap-2 mx-auto align-center">
                <button
                  className="btn-refresh-data btn-refresh"
                  type="button"
                  onClick={refreshData}
                >
                  Refresh <FcSynchronize />
                </button>

                {/* <Button
                  className="btn btn-secondary"
                  type="button"
                  onClick={requestAllNumber}
                  // disabled={buttonRequestDisable}
                  disabled
                >
                  {"<<<"}
                </Button> */}
                <button
                  className="btn-request-right btn-request"
                  onClick={requestNumber}
                  disabled={buttonRequestDisable}
                >
                  <HiArrowLeft />
                </button>
                <button
                  className="btn-return-left btn-return"
                  onClick={returnNumber}
                  disabled={buttonReturnDisable}
                >
                  <HiArrowRight />
                </button>

                {/* <Button
                  className="btn btn-secondary"
                  type="button"
                  disabled
                  onClick={returnAllNumber}
                >
                  {">>>"}
                </Button> */}

                <button
                  className="btn-submit-request"
                  onClick={clickSubmit}
                  type="submit"
                >
                  <span className="btn-submit-request-span">Submit</span>
                </button>
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="m-3">
              <div className="text-center">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Phone No. System Avaliable
                </label>
              </div>
              <div>
                <select
                  className="form-select"
                  multiple
                  size={10}
                  onChange={onSelectAvaliable}
                >
                  {phonenumberElements}
                </select>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PhoneTransfer;
