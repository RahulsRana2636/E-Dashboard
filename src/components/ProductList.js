import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {  Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifydata = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }
  const successNotify = () => toast.success("Product deleted Successfully!", notifydata);
  const errNotify = () => toast.error("Product not deleted!", notifydata);

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let result = await fetch("http://localhost:5000/products", {
      headers: {
        authorization: JSON.parse(localStorage.getItem("token")),
      },
    });
    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    console.warn(id);
    let result = await fetch(`http://localhost:5000/product/${id}`, {
      method: "Delete",
    });
    result = await result.json();
    if (result) {
      getProducts();
    }
  };
 
  const [deleteId, setDeleteId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    errNotify();
    getProducts();
  };
  const handleClickDelete = (id) => {
    setDeleteId(id);
    setShow(true);
  };
  const handleDeleteItem = () => {
    deleteProduct(deleteId);
    setShow(false);
    successNotify();
  };

  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:5000/search/${key}`);
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };
  return (
    <>
      <div className="product-list">
        <h3>Product List</h3>
        <input
          type=""
          className="search-product-box"
          placeholder="Search Product"
          onChange={searchHandle}
        />

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Company Name</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item, index) => (
                <tr key={index + item.task_id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.company}</td>
                  <td>
                    <Link
                      to={"/update/" + item._id}
                      className="btn btn-warning"
                    >
                      Update{" "}
                    </Link>
                  </td>
                  <td>
                    <button
                     onClick={() => handleClickDelete(item._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <h1>No Result Found</h1>
            )}
          </tbody>
        </table>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Confirm Delete?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sure you want to delete product ?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleDeleteItem}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default ProductList;
