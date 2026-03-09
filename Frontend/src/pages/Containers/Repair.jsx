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

export default function Repair() {
  const [showModal, setShowModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoice, setInvoice] = useState({});
  const [status, setStatus] = useState("pending");

  const [loading, setloading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editMember, setEditMember] = useState({});
  const [editRepair, setEditRepair] = useState({});

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
    color: "black",
    border: "1px solid #a28888",
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

    return console.log(data, "the data is ");

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
            Repair
          </span>
          <br></br>
          <div className="repair-tabs">
            {["pending", "repaired", "delivered", "cancelled"].map((item) => (
              <button
                key={item}
                className={`tab-btn ${status === item ? "active-tab" : ""}`}
                onClick={() => setStatus(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
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
            className="btn repair-btn m-2"
            onClick={() => {
              (setEditMember({}), setShowModal(true));
            }}
          >
            New Repair
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
                        backgroundColor: "#F3F4F6",
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
                          {/* <button
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
                          </button> */}
                          change status
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
          title={`${editRepair?._id ? "Edit" : "Create"} Repair Entry`}
          handleSubmit={handleSubmit}
        >
          <Formik
            initialValues={
              editRepair?._id
                ? { ...editRepair }
                : {
                    status: "pending",
                    customer_name: "",
                    customer_phone: "",
                    phone_model: "",
                    brand: "",
                    lock_code: "",
                    repair_date: new Date(),
                    sim: false,
                    memory: false,
                    back_cover: false,
                    problem: "",
                    estimated_price: "",
                    advance_money: "",
                    remaining_amount: "",
                    notes: "",
                  }
            }
            enableReinitialize={true}
            onSubmit={(values) => handleSubmit(values)}
          >
            {(props) => {
              // Auto Calculate Remaining Amount
              const remaining =
                (Number(props.values.estimated_price) || 0) -
                (Number(props.values.advance_money) || 0);

              return (
                <Form onSubmit={props.handleSubmit}>
                  <div className="container">
                    <div className="row">
                      {/* Status */}
                      <div className="col-md-6">
                        <label>Status</label>
                        <select
                          className="form-control"
                          name="status"
                          value={props.values.status}
                          onChange={props.handleChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>

                      {/* Customer Name */}
                      <div className="col-md-6">
                        <label>Customer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="customer_name"
                          placeholder="Enter Name"
                          value={props.values.customer_name}
                          onChange={props.handleChange}
                        />
                      </div>

                      {/* Customer Phone */}
                      <div className="col-md-6 mt-3">
                        <label>Customer Phone</label>
                        <input
                          type="number"
                          className="form-control"
                          name="customer_phone"
                          placeholder="Enter Phone"
                          value={props.values.customer_phone}
                          onChange={props.handleChange}
                        />
                      </div>

                      {/* Phone Model */}
                      <div className="col-md-6 mt-3">
                        <label>Phone Model</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone_model"
                          placeholder="Eg: F21 Pro"
                          value={props.values.phone_model}
                          onChange={props.handleChange}
                        />
                      </div>

                      {/* Brand */}
                      <div className="col-md-6 mt-3">
                        <label>Brand</label>
                        <select
                          className="form-control"
                          name="brand"
                          value={props.values.brand}
                          onChange={props.handleChange}
                        >
                          <option value="">Select Brand</option>
                          <option value="oppo">Oppo</option>
                          <option value="vivo">Vivo</option>
                          <option value="samsung">Samsung</option>
                          <option value="xiaomi">Xiaomi</option>
                          <option value="realme">Realme</option>
                          <option value="apple">Apple</option>
                        </select>
                      </div>

                      {/* Lock Code */}
                      <div className="col-md-6 mt-3">
                        <label>Lock Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lock_code"
                          placeholder="Pattern / PIN"
                          value={props.values.lock_code}
                          onChange={props.handleChange}
                        />
                      </div>

                      {/* Repair Date */}
                      <div className="col-md-6 mt-3">
                        <label>Repair Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="repair_date"
                          value={
                            props.values.repair_date
                              ? formatDateToInput(props.values.repair_date)
                              : ""
                          }
                          onChange={(e) =>
                            props.setFieldValue("repair_date", e.target.value)
                          }
                        />
                      </div>

                      {/* Accessories */}
                      <div className="col-md-6 mt-3">
                        <label>Accessories Received</label>
                        <div>
                          <input
                            type="checkbox"
                            name="sim"
                            checked={props.values.sim}
                            onChange={props.handleChange}
                          />{" "}
                          SIM &nbsp;&nbsp;
                          <input
                            type="checkbox"
                            name="memory"
                            checked={props.values.memory}
                            onChange={props.handleChange}
                          />{" "}
                          Memory &nbsp;&nbsp;
                          <input
                            type="checkbox"
                            name="back_cover"
                            checked={props.values.back_cover}
                            onChange={props.handleChange}
                          />{" "}
                          Back Cover
                        </div>
                      </div>

                      {/* Problem */}
                      <div className="col-md-12 mt-3">
                        <label>Phone Problem</label>
                        <textarea
                          className="form-control"
                          name="problem"
                          rows="3"
                          placeholder="Describe problem..."
                          value={props.values.problem}
                          onChange={props.handleChange}
                        />
                      </div>

                      {/* Estimated Price */}
                      <div className="col-md-6 mt-3">
                        <label>Estimated Price</label>
                        <input
                          type="number"
                          className="form-control"
                          name="estimated_price"
                          value={props.values.estimated_price}
                          onChange={props.handleChange}
                        />
                      </div>

                      {/* Advance */}
                      <div className="col-md-6 mt-3">
                        <label>Advance Money</label>
                        <input
                          type="number"
                          className="form-control"
                          name="advance_money"
                          value={props.values.advance_money}
                          onChange={props.handleChange}
                        />
                      </div>

                      {/* Remaining */}
                      <div className="col-md-6 mt-3">
                        <label>Remaining Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          value={remaining}
                          disabled
                        />
                      </div>

                      {/* Notes */}
                      <div className="col-md-12 mt-3">
                        <label>Notes (Optional)</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          rows="2"
                          value={props.values.notes}
                          onChange={props.handleChange}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                    </div>
                  </div>
                </Form>
              );
            }}
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
