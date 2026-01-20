import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
const logo = "/logo.jpeg";

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

      <div className="container invoice-wrapper my-1 print-area">
        <div className=" p-4">
          {/* Header */}
          <div className="row mb-3">
            <div className="col-md-3 ">
              <h3 className="text-primary fw-bold">
                <img src={logo} alt="" height={"100px"} width={"130px"} />
              </h3>
            </div>

            <div className="col-md-9 text-end">
              <h3 className="fw-bold ">Bhatia Telecom Smartzone</h3>
              <p className="mb-0 ">
                Shop 62A ,Geeta Nagar crossing
                <br />
                Kanpur, Uttar Pradesh 208002
                <br />
                <strong>Mob:</strong> 8726773631
                <br />
                <strong>GSTIN:</strong> 09DQMPB7855K1Z6
              </p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="row border-top border-bottom py-3 ">
            <div className="col-md-6">
              <p>
                <strong>Invoice No:</strong> {invoice.invoiceNumber}
                <br></br>
                <strong>Invoice Date:</strong>{" "}
                {invoice?.bill_date.split("T")[0]}
                <br></br>
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
            <table className="table table-bordered ">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Product Code</th>
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
              <p className="mt-1">
                <strong>Bank Details:</strong>
                <br />
                A/C Name: Bhatia Telecom Smartzone
                <br />
                Bank: Bank of Baroda
                <br />
                A/C Type: Current
              </p>

              <p>
                <strong>Total in Words:</strong>
                <br />
                {numberToWordsIndian(invoice?.totalAmount)} Rupees Only
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
    </div>
  );
}
