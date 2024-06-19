import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Badge, Card, Dropdown, Table, Pagination } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import {
  addData,
  dltdata,
  updateData,
} from "../components/context/ContextProvider";
import Alert from "react-bootstrap/Alert";
import Spiner from "../components/Spiner";
import { BASE_URL } from "../services/helper";
import axios from "axios";

const Home = () => {
  const [userdata, setUserData] = useState([]);
  const [showspin, setShowSpin] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const { useradd, setUseradd } = useContext(addData);
  const { update, setUpdate } = useContext(updateData);
  const { deletedata, setDLtdata } = useContext(dltdata);
  const navigate = useNavigate();

  const AddUser = () => {
    navigate("/register");
  };

  // API functions
  const usergetfunc = async (search, gender, status, sort, page) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/details`, {
        params: { search, gender, status, sort, page },
      });
      if (response.status === 200) {
        setUserData(response.data.usersdata);
        setPageCount(response.data.Pagination.pageCount);
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data");
    }
  };

  const deletfunc = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/user/delete/${id}`);
      if (response.status === 200) {
        usergetfunc(search, gender, status, sort, page); // Refresh user list
        setDLtdata(response.data);
        toast.success("User deleted successfully");
      } else {
        toast.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };
// pending this functionality
  const exporttocsvfunc = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/userexport`);
      if (response.status === 200) {
        window.open(response.data.downloadUrl, "_blank");
      } else {
        toast.error("Error exporting users to CSV");
      }
    } catch (error) {
      console.error("Error exporting users to CSV:", error);
      toast.error("Error exporting users to CSV");
    }
  };

  const statuschangefunc = async (id, status) => {
    try {
      const response = await axios.put(`${BASE_URL}/user/status/${id}`, {
        status,
      });
      if (response.status === 200) {
        usergetfunc(search, gender, status, sort, page); // Refresh user list
        toast.success("Status Updated");
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  // Pagination
  const handlePrevious = () => {
    setPage((prevPage) => (prevPage === 1 ? prevPage : prevPage - 1));
  };

  const handleNext = () => {
    setPage((prevPage) => (prevPage === pageCount ? prevPage : prevPage + 1));
  };

  useEffect(() => {
    const fetchData = async () => {
      await usergetfunc(search, gender, status, sort, page);
      setShowSpin(false);
    };
    fetchData();
  }, [search, gender, status, sort, page]);

  return (
    <>
      {useradd && (
        <Alert variant="success" onClose={() => setUseradd("")} dismissible>
          {useradd.fname.toUpperCase()} Successfully Added
        </Alert>
      )}

      {update && (
        <Alert variant="primary" onClose={() => setUpdate("")} dismissible>
          {update.fname.toUpperCase()} Successfully Updated
        </Alert>
      )}

      {deletedata && (
        <Alert variant="danger" onClose={() => setDLtdata("")} dismissible>
          {deletedata.fname.toUpperCase()} Successfully Deleted
        </Alert>
      )}

      <div className="container">
        <div className="main_div">
          <div className="search_add mt-4 d-flex justify-content-between">
            <div className="search col-lg-4">
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  variant="success"
                  className="search_btn"
                  onClick={() =>
                    usergetfunc(search, gender, status, sort, page)
                  }
                >
                  Search
                </Button>
              </Form>
            </div>
            <div className="add_btn">
              <Button variant="primary" onClick={AddUser}>
                <i className="fa-solid fa-plus"></i>&nbsp; Add User
              </Button>
            </div>
          </div>

          <div className="filter_div mt-5 d-flex justify-content-between flex-wrap">
            <div className="export_csv">
              <Button
                className="export_btn"
                onClick={exporttocsvfunc}
                style={{
                  background: "#479C88",
                  border: "none",
                  marginRight: "10px", // Example inline style for margin-right
                }}
              >
                Export To CSV
              </Button>
            </div>
            <div className="filter_gender">
              <div className="filter">
                <h3>Filter By Gender</h3>
                <div className="gender d-flex justify-content-between">
                  <Form.Check
                    type="radio"
                    label="All"
                    name="gender"
                    value="All"
                    onChange={(e) => setGender(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type="radio"
                    label="Male"
                    name="gender"
                    value="Male"
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Female"
                    name="gender"
                    value="Female"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="filter_newold">
              <h3>Sort By Value</h3>
              <Dropdown className="text-center">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    fontSize: "20px",
                  }}
                >
                  <i className="fa-solid fa-sort"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSort("new")}>
                    New
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSort("old")}>
                    Old
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="filter_status">
              <div className="status">
                <h3>Filter By Status</h3>
                <div className="status_radio d-flex justify-content-between flex-wrap">
                  <Form.Check
                    type="radio"
                    label="All"
                    name="status"
                    value="All"
                    onChange={(e) => setStatus(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type="radio"
                    label="Active"
                    name="status"
                    value="Active"
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Inactive"
                    name="status"
                    value="Inactive"
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showspin ? (
          <Spiner />
        ) : (
          <div className="container">
            <div className="col mt-0">
              <Card className="shadow">
                <Table className="align-items-center" responsive="sm">
                  <thead className="thead-dark">
                    <tr className="table-dark">
                      <th>ID</th>
                      <th>FullName</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th>Profile</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userdata.length > 0 ? (
                      userdata.map((element, index) => (
                        <tr key={element._id}>
                          <td>{index + 1 + (page - 1) * 4}</td>
                          <td>{element.fname + element.lname}</td>
                          <td>{element.email}</td>
                          <td>{element.gender === "Male" ? "M" : "F"}</td>
                          <td className="d-flex align-items-center">
                            <Dropdown className="text-center">
                              <Dropdown.Toggle
                                id="dropdown-basic"
                                style={{ background: "none", border: "none" }}
                                className="dropdown_btn"
                              >
                                <Badge
                                  bg={
                                    element.status === "Active"
                                      ? "primary"
                                      : "danger"
                                  }
                                >
                                  {element.status}{" "}
                                  <i className="fa-solid fa-angle-down"></i>
                                </Badge>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() =>
                                    statuschangefunc(element._id, "Active")
                                  }
                                >
                                  Active
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    statuschangefunc(element._id, "InActive")
                                  }
                                >
                                  InActive
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                          <td className="img_parent">
                            <img
                               src={`${BASE_URL}/images/uploads/${element.profile}`}
                              alt="img"
                              style={{ width: "35px", borderRadius: "50%" }}
                            />
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="light"
                                id="dropdown-basic"
                                style={{ background: "none", border: "none" }}
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item>
                                  <NavLink
                                    to={`/userprofile/${element._id}`}
                                    className="text-decoration-none"
                                  >
                                    <i
                                      className="fa-solid fa-eye"
                                      style={{ color: "green" }}
                                    ></i>{" "}
                                    <span>View</span>
                                  </NavLink>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                  <NavLink
                                    to={`/edit/${element._id}`}
                                    className="text-decoration-none"
                                  >
                                    <i
                                      className="fa-solid fa-pen-to-square"
                                      style={{ color: "blue" }}
                                    ></i>{" "}
                                    <span>Edit</span>
                                  </NavLink>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                  <div onClick={() => deletfunc(element._id)}>
                                    <i
                                      className="fa-solid fa-trash"
                                      style={{ color: "red" }}
                                    ></i>{" "}
                                    <span>Delete</span>
                                  </div>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          NO Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card>
            </div>
          </div>
        )}

        {pageCount > 0 && (
          <div className="pagination_div d-flex justify-content-end mx-5">
            <Pagination>
              <Pagination.Prev onClick={handlePrevious} />
              {Array.from({ length: pageCount }, (_, index) => (
                <Pagination.Item
                  key={index}
                  active={page === index + 1}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={handleNext} />
            </Pagination>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
