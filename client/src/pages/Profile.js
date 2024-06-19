import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
import Spiner from "../components/Spiner";
import { BASE_URL } from "../services/helper";
import moment from "moment";

const Profile = () => {
  const [userprofile, setUserProfile] = useState({});
  const [showspin, setShowSpin] = useState(true);

  const { id } = useParams();

  const userProfileGet = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/${id}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setShowSpin(false);
    }
  };

  useEffect(() => {
    userProfileGet();
  }, [id]);

  return (
    <>
      {showspin ? (
        <Spiner />
      ) : (
        <div className="container">
          <Card className="card-profile shadow col-lg-6 mx-auto mt-5">
            <Card.Body>
              <Row>
                <div className="col">
                  <div className="card-profile-stats d-flex justify-content-center">
                    <img
                      src={`${BASE_URL}/images/uploads/${userprofile.profile}`}
                      alt=""
                      style={{
                        maxWidth: "86px",
                        borderRadius: "50%",
                        border: "1px solid #111",
                      }}
                    />
                  </div>
                </div>
              </Row>
              <div className="text-center">
                <h3>
                  {userprofile.fname} {userprofile.lname}
                </h3>
                <h4>
                  <i
                    className="fa-solid fa-envelope email"
                    style={{ color: "rgb(238, 101, 122)" }}
                  ></i>
                  &nbsp;:- <span>{userprofile.email}</span>{" "}
                </h4>
                <h5>
                  <i className="fa-solid fa-mobile"></i>&nbsp;:-{" "}
                  <span>{userprofile.mobile}</span>{" "}
                </h5>
                <h4>
                  <i className="fa-solid fa-person"></i>&nbsp;:-{" "}
                  <span>{userprofile.gender}</span>{" "}
                </h4>
                <h4>
                  <i
                    className="fa-solid fa-location-pin location"
                    style={{ color: "blue" }}
                  ></i>
                  &nbsp;:- <span>{userprofile.location}</span>{" "}
                </h4>
                <h4>
                  Status&nbsp;:- <span>{userprofile.status}</span>{" "}
                </h4>
                <h5>
                  <i
                    className="fa-solid fa-calendar-days calendar"
                    style={{ color: "rebeccapurple" }}
                  ></i>
                  &nbsp;Date Created&nbsp;:-{" "}
                  <span>
                    {moment(userprofile.datecreated).format("DD-MM-YYYY")}
                  </span>{" "}
                </h5>
                <h5>
                  {" "}
                  <i className="fa-solid fa-calendar-days calendar"></i>
                  &nbsp;Date Updated&nbsp;:-{" "}
                  <span>{userprofile.dateUpdated}</span>{" "}
                </h5>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};

export default Profile;
