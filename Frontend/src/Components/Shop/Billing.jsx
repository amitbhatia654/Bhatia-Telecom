import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
// import Modal from "./HelperPages/Modal";
import Modal from "../../pages/HelperPages/Modal";

import { Formik, ErrorMessage, Form, FieldArray, Field } from "formik";
import axiosInstance from "../../ApiManager";
const dp_image = "/user.jpg";
const logo = "/logo.jpeg";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import toast from "react-hot-toast";
import { addMember } from "../../assets/FormSchema";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Pagination from "../../pages/HelperPages/Pagination";
import { useNavigate } from "react-router-dom";
import {
  formatDateToDisplay,
  formatDateToInput,
} from "../.././assets/FrontendCommonFunctions";
// import ConfirmModal from "/HelperPages/ConfirmModal";
import ConfirmModal from "../../pages/HelperPages/Modal";

import moment from "moment";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Billing() {
  const [showModal, setShowModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoice, setInvoice] = useState({});

  const [loading, setloading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editMember, setEditMember] = useState({});
  const [search, setSearch] = useState("");
  const [rowSize, setRowSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allMembers, setAllMembers] = useState([]);
  const [allTrainers, setAllTrainers] = useState([]);
  const totalPages = Math.ceil(totalCount / rowSize);

  const [confirmModalData, setConfirmModalData] = useState({
    open: false,
    answer: "",
  });
  const navigate = useNavigate();
  const headStyle = {
    fontWeight: "bold",
    color: "#fff",
    border: "1px solid #e0e0e0",
    textAlign: "center",
  };

  const bodyStyle = {
    border: "1px solid #e0e0e0",
    textAlign: "center",
    fontSize: "14px",
  };

  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleSubmit = async (values) => {
    setSubmitLoading(true);

    var data = {
      ...values,
    };

    const res = editMember._id
      ? await axiosInstance.put(`/api/gym/member`, data)
      : await axiosInstance.post(`api/create-invoice`, data);

    setSubmitLoading(false);
    // if (res.status == 200) {
    //   if (editMember._id) {
    //     if (res.data.memberResult.status == "active") {
    //       const updatedMember = allMembers.map((folder) => {
    //         if (folder._id == values._id) {
    //           return res.data.memberResult;
    //         }
    //         return folder;
    //       });
    //       setAllMembers(updatedMember);
    //     } else {
    //       const updatedMembers = allMembers.filter(
    //         (member) => member._id !== res.data.memberResult._id,
    //       );
    //       setAllMembers(updatedMembers);
    //     }
    //   } else {
    //     if (
    //       allMembers.length < rowSize &&
    //       res.data.memberResult.status == "active"
    //     )
    //       allMembers.push(res.data.memberResult);
    //     else {
    //       const updatedMembers = allMembers.filter(
    //         (member) => member._id !== res.data.memberResult._id,
    //       );
    //       setAllMembers(updatedMembers);
    //     }
    //   }
    //   toast.success(res.data.message);
    //   setEditMember({});
    //   setShowModal(false);
    // }

    if (res.status == 201) {
      allMembers.push(res.data.invoiceDetails);
      setShowModal(false);
      console.log(res, "response is");
    }
  };

  const deleteMember = async (memberId) => {
    const userResponse = await showConfirmationModal();
    if (userResponse != "yes") return;
    const res = await axiosInstance.delete(`/api/gym/member`, {
      data: { memberId },
    });
    if (res.status == 200) {
      toast.success(res.data.message);

      const updatedMembers = allMembers.filter(
        (member) => member._id !== memberId,
      );
      setAllMembers(updatedMembers);
    } else toast.error(res.data.message);
  };

  const fetchData = async () => {
    setloading(true);

    const res = await axiosInstance.get("/api/get-invoices", {
      params: { search, rowSize, currentPage },
    });
    if (res.status == 200) {
      setAllMembers(res.data.response);
      setTotalCount(res.data.totalCount);
    } else {
      setAllMembers([]);
      setTotalCount(0);
    }
    setloading(false);
  };

  const fetchTrainersList = async () => {
    const res = await axiosInstance.get("/api/gym/trainers-list", {
      params: {},
    });
    if (res.status == 200) {
      setAllTrainers(res.data.response);
    } else {
      setAllTrainers([]);
    }
  };

  useEffect(() => {
    fetchTrainersList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [search, rowSize, currentPage]);

  const showConfirmationModal = () => {
    return new Promise((resolve) => {
      setConfirmModalData({
        open: true,
        onClose: (answer) => {
          resolve(answer);
        },
      });
    });
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <div>
          <span
            className="mx-2"
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              color: "#47478C",
            }}
          >
            Invoices
          </span>
        </div>
        <div>
          <TextField
            type="text"
            sx={{ width: "200px", mt: 1 }}
            size="small"
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="search"
          ></TextField>

          <button
            className="btn btn-primary m-2"
            onClick={() => {
              (setEditMember({}), setShowModal(true));
            }}
          >
            Create Bill / Invoice
          </button>
        </div>
      </div>
      <div className="">
        <div
          className="scrollable-container"
          style={{ minHeight: "75.5vh", maxHeight: "75.5vh" }}
        >
          <div className="d-flex flex-wrap mt-1">
            {loading ? (
              <>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "70vh", minWidth: "80vw" }}
                >
                  <div className="loader"></div>
                </div>
              </>
            ) : allMembers.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Table aria-label="invoice table">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#1976d2",
                      }}
                    >
                      <TableCell sx={headStyle}>S.No.</TableCell>
                      <TableCell sx={headStyle}>Customer Name</TableCell>
                      <TableCell sx={headStyle}>Customer Contact</TableCell>
                      <TableCell sx={headStyle}>Bill Date</TableCell>
                      <TableCell sx={headStyle}>Items</TableCell>
                      <TableCell sx={headStyle}>Bill Amount</TableCell>
                      <TableCell sx={headStyle}>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {allMembers.map((row, index) => (
                      <TableRow key={row._id} hover>
                        <TableCell sx={bodyStyle}>{index + 1}</TableCell>
                        <TableCell sx={bodyStyle}>{row.cr_name}</TableCell>
                        <TableCell sx={bodyStyle}>
                          {row.cr_phone_number}
                        </TableCell>
                        <TableCell sx={bodyStyle}>
                          {new Date(row.bill_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={bodyStyle}>
                          {row.items?.length}
                        </TableCell>
                        <TableCell sx={bodyStyle}>
                          ₹ {row.totalAmount}
                        </TableCell>
                        <TableCell sx={bodyStyle}>
                          <button
                            // onClick={() => {
                            //   setShowInvoice(true);
                            //   setInvoice(row);
                            // }}
                            onClick={() =>
                              navigate("/view-invoice", {
                                state: { invoice: row },
                              })
                            }
                            className="btn btn-sm btn-primary"
                          >
                            View Invoice
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "70vh", minWidth: "80vw" }}
                >
                  <h5 style={{ color: "#47478C" }}>No Bills Found !</h5>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Pagination
        setRowSize={setRowSize}
        rowSize={rowSize}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      ></Pagination>

      {showModal && (
        <Modal
          setShowModal={setShowModal}
          //   otherFunc={setEditMember}
          title={`${editMember._id ? "Edit" : "Create"}  Invoice`}
          handleSubmit={handleSubmit}
        >
          <Formik
            initialValues={
              editMember._id
                ? {
                    ...editMember,
                    planRenew: editMember.lastPayment.planRenew,
                    paymentMode: editMember.lastPayment.paymentMode,
                    memberPlan: editMember.lastPayment.memberPlan,
                    assigned_trainer: editMember?.assigned_trainer?._id,

                    items: [
                      {
                        pd_name: "",
                        pd_code: "",
                        price: "",
                        warranty: "",
                      },
                    ],
                  }
                : {
                    paymentMode: "cash",
                    bill_date: new Date(),
                    items: [
                      {
                        pd_name: "",
                        pd_code: "",
                        price: "",
                        warranty: "",
                      },
                    ],
                  }
            }
            // validationSchema={addMember}
            enableReinitialize={true}
            onSubmit={(values) => handleSubmit(values)}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <div className=" ">
                  <div className="container">
                    <div className="row ">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">
                            Customer Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter Name"
                            value={props.values.cr_name}
                            name="cr_name"
                            onChange={props.handleChange}
                          />

                          <ErrorMessage
                            name="cr_name"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="phone-number">Phone Number</label>
                          <input
                            type="number"
                            className="form-control"
                            id="phone-number"
                            placeholder="Enter Phone Number"
                            value={props.values.cr_phone_number}
                            name="cr_phone_number"
                            // onChange={props.handleChange}
                            onChange={(e) => {
                              if (e.target.value.length < 11)
                                props.setFieldValue(
                                  "cr_phone_number",
                                  e.target.value,
                                );
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="cr_phone_number"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </div>

                      <div className="col-md-6 ">
                        <div className="form-group">
                          <label htmlFor="address">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            id="address"
                            placeholder="Enter Address"
                            value={props.values.cr_address}
                            name="cr_address"
                            onChange={props.handleChange}
                          />
                        </div>
                        <ErrorMessage
                          name="cr_address"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </div>

                      <hr className="my-3" />
                      <h5 style={{ color: "#47478C" }}>Products</h5>

                      <FieldArray name="items">
                        {({ push, remove }) => (
                          <>
                            {props.values?.items?.map((item, index) => (
                              <div className="row mt-2" key={index}>
                                {/* Product Name */}

                                <div className="col-md-3">
                                  <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name={`items.${index}.pd_name`}
                                      value={item.pd_name}
                                      placeholder="Product Name"
                                      onChange={props.handleChange}
                                    />
                                  </div>
                                </div>

                                {/* Product Model */}
                                <div className="col-md-3">
                                  <div className="form-group">
                                    <label>Product Model</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name={`items.${index}.pd_code`}
                                      value={item.pd_code}
                                      placeholder="Model / Code"
                                      onChange={props.handleChange}
                                    />
                                  </div>
                                </div>

                                {/* Product Price */}
                                <div className="col-md-3">
                                  <div className="form-group">
                                    <label>Price</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name={`items.${index}.price`}
                                      value={item.price}
                                      placeholder="Price"
                                      onChange={props.handleChange}
                                    />
                                  </div>
                                </div>

                                {/* Product Warranty */}
                                <div className="col-md-3">
                                  <div className="form-group">
                                    <label>Warranty</label>
                                    <select
                                      className="form-control"
                                      name={`items.${index}.warranty`}
                                      value={item.warranty}
                                      onChange={props.handleChange}
                                    >
                                      <option value="">Select</option>
                                      <option value="1">1 Month</option>
                                      <option value="3">3 Months</option>
                                      <option value="6">6 Months</option>
                                      <option value="12">12 Months</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Remove Button */}
                                <div className="col-md-1 d-flex align-items-end">
                                  {props.values.items.length > 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={() => remove(index)}
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Add Row Button */}
                            <div className="mt-3">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() =>
                                  push({
                                    pd_name: "",
                                    pd_code: "",
                                    price: "",
                                  })
                                }
                              >
                                ➕ Add Product
                              </button>
                            </div>
                          </>
                        )}
                      </FieldArray>

                      <div className="col-md-6 mt-3">
                        <div className="form-group">
                          <label htmlFor="planRenew">Bill Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="planRenew"
                            name="planRenew"
                            value={
                              props.values?.bill_date
                                ? formatDateToInput(props.values.bill_date)
                                : ""
                            }
                            onChange={(e) => {
                              props.setFieldValue("bill_date", e.target.value);
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="planRenew"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </div>

                      <div className="col-md-6 mt-3">
                        <div className="form-group">
                          <label htmlFor="membership">Payment Mode</label>
                          <select
                            className="form-control"
                            id="paymentMode"
                            name="paymentMode"
                            value={props.values.paymentMode} // Ensure it's `value`, not `values`
                            onChange={(e) =>
                              props.setFieldValue("paymentMode", e.target.value)
                            } // Update state
                          >
                            <option value={"cash"}>Cash</option>
                            <option value={"online"}>Online</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center mt-4">
                    <Button
                      variant="outlined"
                      type="submit"
                      sx={{
                        my: 1,
                        color: "#47478c",
                        backgroundColor: "white",
                        fontSize: "16px",
                      }}
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <span className="spinner-border "></span>
                      ) : (
                        "submit"
                      )}{" "}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {showInvoice && (
        <Modal
          setShowModal={setShowInvoice}
          //   otherFunc={setEditMember}
          title={""}
        >
          <div className="container invoice-wrapper my-4">
            <div className="invoice-box p-4">
              {/* Header */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5 className="fw-bold">Bhatia Telecom Smartzone</h5>
                  <p className="mb-0 small">
                    Shop 62A Geeta Nagar <br />
                    Kanpur, Uttar Pradesh 208002
                    <br />
                    8726773631
                    <br />
                    <strong>GSTIN:</strong> 09DQMPB7855K1Z6
                  </p>
                </div>

                <div className="col-md-6 text-end">
                  <h3 className="text-primary fw-bold">
                    <img src={logo} alt="" height={"100px"} width={"130px"} />
                  </h3>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="row border-top border-bottom py-2 small">
                <div className="col-md-6">
                  <p>
                    <strong>Invoice No:</strong> {invoice.invoiceNumber}
                  </p>
                  <p>
                    <strong>Invoice Date:</strong>{" "}
                    {invoice?.bill_date.split("T")[0]}
                  </p>

                  <p>
                    <strong>Payment Mode:</strong> {invoice?.paymentMode}
                  </p>
                </div>
                <div className="col-md-6">
                  <strong>Bill To:</strong>
                  <p className="mb-0">
                    Mr./Ms {invoice?.cr_name}
                    <br />
                    {invoice?.cr_address}
                    <br />
                    Mob - {invoice?.cr_phone_number}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="table-responsive mt-4">
                <table className="table table-bordered small">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Description</th>
                      <th>HSN</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>CGST 9%</th>
                      <th>SGST 9%</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.items.map((item, key) => {
                      return (
                        <tr>
                          <td>{key + 1}</td>
                          <td>{item?.pd_name}</td>
                          <td>{item?.pd_code}</td>
                          <td>{1}</td>
                          <td>{item?.price}</td>
                          <td>{0.0}</td>
                          <td>{0.0}</td>
                          <td>{item.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="row mt-3">
                <div className="col-md-6 small">
                  <p>
                    <strong>Total in Words:</strong>
                    <br />
                    Indian Rupees One Lakh Twenty Five Thousand Only
                  </p>

                  <p className="mt-4">
                    <strong>Bank Details:</strong>
                    <br />
                    A/C Name: Bhatia Telecom Smartzone
                    <br />
                    Bank: Bank of Baroda
                    <br />
                    A/C Type: Current
                  </p>
                </div>

                <div className="col-md-6">
                  <table className="table table-bordered small">
                    <tbody>
                      <tr>
                        <td>Sub Total</td>
                        <td className="text-end">₹ {invoice.totalAmount}</td>
                      </tr>
                      <tr>
                        <td>CGST (9%)</td>
                        <td className="text-end">₹0</td>
                      </tr>
                      <tr>
                        <td>SGST (9%)</td>
                        <td className="text-end">₹0</td>
                      </tr>
                      <tr className="fw-bold">
                        <td>Total</td>
                        <td className="text-end">₹ {invoice?.totalAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="text-end mt-5 small">
                <p>For Bhatia Telecom Smartzone</p>
                <p className="fw-bold">Authorised Signatory</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {confirmModalData.open && (
        <ConfirmModal
          title={"Are You Sure You Want to Delete"}
          setConfirmModalData={setConfirmModalData}
          onClose={confirmModalData.onClose}
        ></ConfirmModal>
      )}
    </>
  );
}
