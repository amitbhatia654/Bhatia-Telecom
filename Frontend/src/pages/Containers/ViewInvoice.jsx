import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
const logo = "/logo.jpeg";
const myqr = "/myqr.jpeg";
const vivo = "./vivo1.jpeg";
const oppo = "./oppo.png";
const samsung = "./samsung.png";
const realme = "./realme.png";
const itel = "./itel.png";
const ubon = "./ubon.png";

export default function ViewInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const invoice = location.state.invoice;

  function numberToWordsIndian(num) {
    if (num === 0) return "Zero";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const getWords = (n) => {
      if (n < 20) return ones[n];
      if (n < 100)
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      if (n < 1000)
        return (
          ones[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + getWords(n % 100) : "")
        );
      return "";
    };

    let result = "";

    if (Math.floor(num / 100000) > 0) {
      result += getWords(Math.floor(num / 100000)) + " Lakh ";
      num %= 100000;
    }

    if (Math.floor(num / 1000) > 0) {
      result += getWords(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }

    if (num > 0) {
      result += getWords(num);
    }

    return result.trim();
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => navigate("/invoice")}>
        Back
      </button>

      <button className="btn btn-success ms-2" onClick={() => window.print()}>
        Print Invoice
      </button>

      <div className="invoice-wrapper print-area">
        <div className="p-4 ">
          {/* Header */}
          <div className="row mb-3">
            <div className="col-md-9">
              <h1 className="fw-bold text-primary">Bhatia Telecom Smartzone</h1>

              <p className="mb-0">
                Shop 62A, Geeta Nagar Crossing ,<br />
                Infront of Metro pillar 187 , <br />
                Kanpur U.P. 208002 <br />
                <strong>Mob:</strong> 8726773631
              </p>
            </div>

            <div className="col-md-3 text-end">
              <img src={logo} alt="logo" height="100" width="150" />
            </div>
          </div>

          {/* Invoice Title */}
          <div className="row border text-center fw-bold py-1">
            <div className="col-md-4"></div>
            <div className="col-md-4">INVOICE</div>
            <div className="col-md-4 text-end">Original For Receipt</div>
          </div>

          {/* Invoice Info */}
          <div className="row border-top border-bottom py-3">
            <div className="col-md-6">
              <strong>Bill To :</strong>

              <p className="mb-1">
                <strong>Name:</strong> {invoice?.cr_name}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {invoice?.cr_address}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {invoice?.cr_phone_number}
              </p>
            </div>

            <div className="col-md-6">
              <p>
                <strong>Invoice No:</strong> {invoice.invoiceNumber} <br />
                <strong>Invoice Date:</strong>{" "}
                {new Date(invoice?.bill_date).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
                <br></br>
                <strong>Payment Mode:</strong> {invoice?.paymentMode}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="inner-box">
            <div className="table-responsive mt-4">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Product Code</th>
                    <th>Warranty</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>

                <tbody>
                  {invoice?.items.map((item, key) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{item?.pd_name}</td>
                      <td>{item?.pd_code}</td>
                      <td>{item?.warranty}</td>
                      <td>1</td>
                      <td>₹ {item?.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="row mt-3">
              <div className="col-md-7 small">
                <p>
                  <strong>Bank Details:</strong>
                  <br />
                  A/C Name: Bhatia Telecom Smartzone <br />
                  Bank: Bank of Baroda <br />
                  A/C Type: Current
                </p>

                <img src={myqr} alt="qr" height="80" />
              </div>

              <div className="col-md-5">
                <table className="table table-bordered small">
                  <tbody>
                    <tr className="fw-bold">
                      <td className="text-center fw-bold fs-6">Total</td>
                      <td className="text-center fw-bold fs-6">
                        ₹ {invoice?.totalAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  <strong>Total in Words:</strong>
                  <br />
                  {numberToWordsIndian(invoice?.totalAmount)} Rupees Only
                </p>
              </div>
            </div>

            {/* <hr /> */}

            {/* Footer */}
            <div className=" mt-3">
              <div className="footer-top">
                <div className="terms">
                  <h5>Terms & Conditions</h5>
                  <ul>
                    <li>Warranty as per company policy only.</li>
                    <li>Please keep this invoice for warranty claims.</li>
                    <li>Accessories have no warranty unless specified.</li>
                    <li>All disputes are subject to Kanpur jurisdiction.</li>
                  </ul>
                </div>

                <div className="text-center ">
                  <p className="">For Bhatia Telecom Smartzone</p>
                  <p className="fw-bold">Authorised Signatory</p>
                </div>
              </div>
            </div>
          </div>
          {/* test */}
          {/* Brand Logos */}
        </div>
        <div className="footer-bottom">
          <div>
            <img src={samsung} height="70" width={"130px"} />
            <img src={oppo} height="70" width={"130px"} />
            <img src={vivo} height="70px" width={"100px"} className="mx-1" />
            <img src={realme} height="70" width={"120px"} />
            <img src={itel} height="70" width={"100px"} />
            <img src={ubon} height="70" width={"100px"} />
          </div>
          {/* <div className="row ">
                <div className="col-md-2  ">
                  <img src={vivo} height="70px" width={"100px"} />
                </div>
                <div className="col-md-2  ">
                  <img src={oppo} height="70" width={"130px"} />
                </div>
                <div className="col-md-2 ">
                  <img src={samsung} height="70" width={"130px"} />
                </div>
                <div className="col-md-2 ">
                  <img src={realme} height="70" width={"130px"} />
                </div>
                <div className="col-md-2">
                  <img src={itel} height="70" width={"120px"} />
                </div>
                <div className="col-md-2">
                  <img src={ubon} height="70" width={"100px"} />
                </div>
              </div> */}

          <div className="text-center thanks-line">
            <p>
              Thank you for shopping with us! 🙏 <br />
              {/* This is a computer generated invoice. */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
