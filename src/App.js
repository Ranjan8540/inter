import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortvalue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(20);
   const [sortFilterValue, setSortFilterValue] = useState("");
   const [operation, setOperation] = useState("");
  

  const sortOptions = ["first_name", "last_name", "email", "gender", "domain"];

  useEffect(() => {
    loadUsersData(0, 20, 0);
  }, []);

  const loadUsersData = async (start, end, increase, optType=null, filterOrSortValue) => {
    switch (optType){
      case "search":
        setOperation(optType);
        setSortValue("");
        return await axios
      .get(`http://localhost:5000/comments?q=${value}&_start=${start}&_end=${end}`)
      .then((response) => {
        setData(response.data);
        setCurrentPage(currentPage + increase);
        // setValue("");
      })
      .catch((err) => console.log(err));
      default:
        return await axios
      .get(`http://localhost:5000/comments?_start=${start}&_end=${end}`)
      .then((response) => {
        setData(response.data);
        setCurrentPage(currentPage + increase);
      })
      .catch((err) => console.log(err));
    }
    
  };

  console.log("data", data);

  const handleReset = () => {
    loadUsersData(0, 20, 0);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    loadUsersData(0, 20, 0, "search")
    // return await axios
    //   .get(`http://localhost:5000/comments?=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //     setValue("");
    //   })
    //   .catch((err) => console.log(err));
  };

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    return await axios
      .get(`http://localhost:5000/comments?_sort=${value}&_order=asc`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const handleFilter = async (value) => {
    return await axios
      .get(`http://localhost:5000/comments?gender=${value}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const renderPagination = () => {
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData(20, 40,  1, operation)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
              <MDBBtn
                onClick={() =>
                  loadUsersData((currentPage - 1) * 20, currentPage * 20, -1, operation)
                }
              >
                Prev
              </MDBBtn>
            </MDBPaginationItem>
            <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUsersData((currentPage + 1) * 20, (currentPage + 2) * 20, 1, operation)}
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData(20, 40, -1, operation)}>Prev</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return (
    <MDBContainer>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search first_name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <MDBBtn type="submit" color="dark">
          Search
        </MDBBtn>
        <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>
          Reset
        </MDBBtn>
      </form>

      <div style={{ marginTop: "100px" }}>
        <h2>Ranjan kumar</h2>
        <MDBRow>
          <MDBCol size={1050}>
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">First_Name</th>
                  <th scope="col">Last_Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Domain</th>
                  <th scope="col">Avatar</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className="aline-center mb-0">
                  <tr>
                    <td colSpan={8} className="text-center mb-0">
                      No Data Found
                    </td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <th>{item.first_name}</th>
                      <th>{item.last_name}</th>
                      <th>{item.email}</th>
                      <th>{item.gender}</th>
                      <th>{item.domain}</th>
                      <th>{item.avatar}</th>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "250px",
            alignContent: "center",
          }}
        >
          {renderPagination()}
        </div>
      </div>
      <MDBRow>
        <MDBCol size={"8"}>
          <h5>Sort By:</h5>
          <select
            style={{ width: "300px", borderRadius: "2px", height: "35px" }}
            onChange={handleSort}
            value={sortvalue}
          >
            <option>Please Select Value</option>
            {sortOptions.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </MDBCol>
        <MDBCol size={"4"}>
          <h5>Filter By Gender</h5>
          <MDBBtnGroup>
            <MDBBtn color="success" onClick={() => handleFilter("Male")}>
              Male
            </MDBBtn>
            <MDBBtn
              color="danger"
              style={{ marginLeft: "2px" }}
              onClick={() => handleFilter("Female")}
            >
              Female
            </MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
