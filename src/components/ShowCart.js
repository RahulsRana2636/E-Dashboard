import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifydata = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};
const successNotify = () => toast.success("Remove products from the cart!", notifydata);
const ShowCart = () => {
  const [carProducts, setCartProducts] = useState([]);
  const callApiCartList = async () => {
    try {
      const url = process.env.REACT_APP_API_URL + "view-cart";
      const response = await axios.get(url, {
        headers: {
          Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      setCartProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = async (id) => {
    let result = await fetch(process.env.REACT_APP_API_URL + `remove-from-cart/${id}`, {
      method: "Delete",
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    if (result) {
      callApiCartList();
    }
  };
  const handleRemoveFromCart = (productId) => {
    removeProduct(productId);
    successNotify();
  };
  const totalSum = carProducts.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0
  );

  useEffect(() => {
    callApiCartList();
  }, []);
  return (
    <div className="product-list-container">
      <div className="product-list">
        <h3>Cart List</h3>
        <p>Total Price: {totalSum.toFixed(2)}</p>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {carProducts.length > 0 ? (
              carProducts.map((item, index) => (
                <tr key={index + item.task_id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Result Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ShowCart;
