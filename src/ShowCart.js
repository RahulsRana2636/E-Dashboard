import React from 'react';
import { useCart } from "./components/CartContext";
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
const successNotify = () =>toast.success("Remove products from the cart!", notifydata);
const ShowCart = () => {
    const { cart, removeFromCart } = useCart();

    const handleRemoveFromCart = (productId) => {
      removeFromCart(productId);
      successNotify();
    };
    const totalSum = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);


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
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <tr key={index + item.task_id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>   
                    <td> <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item._id)}>
                  Remove
                </button></td>                
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

export default ShowCart
