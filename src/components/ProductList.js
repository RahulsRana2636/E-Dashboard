import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
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
const successNotify = () =>toast.success("Product deleted Successfully!", notifydata);
const successNotify1= () =>toast.success("Product added to cart", notifydata);
const errNotify = () => toast.error("Product not deleted!", notifydata);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("clear"); 
  

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let result = await fetch(process.env.REACT_APP_API_URL + "products", {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    setProducts(result);
    
  };

  const deleteProduct = async (id) => {
    console.warn(id);
    let result = await fetch(process.env.REACT_APP_API_URL + `product/${id}`, {
      method: "Delete",
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
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
      let result = await fetch(
        process.env.REACT_APP_API_URL + `search/${key}`,
        {
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };

  const priceFilter = (sortOrder) => {
    let sortedProducts;
  
    if (sortOrder === "clear") {
      getProducts();
      return;
    }
  
    sortedProducts = [...products].sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
  
      if (sortOrder === "esc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  
    setProducts(sortedProducts);
  };
  

  const handleSortChange = (event) => {
    const selectedSortOrder = event.target.value;
    setSortOrder(selectedSortOrder);
    priceFilter(selectedSortOrder);
  };
  const handleAddToCart = async (product) => {
    try{
    const result = await fetch(process.env.REACT_APP_API_URL + "add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify( product ), 
    });
    if(result.status==200){
    successNotify1();
    }
  }
  catch(err){
    console.log(err)
  }
  };
 
  
  return (
    <>
      <div className="product-list-container">
        <div className="product-list">
          <h3>Product List</h3>
          <div className="filter-box">
            <input
              type="text"
              className="search-product-box"
              placeholder="Search Product"
              onChange={searchHandle}
            />
            <select value={sortOrder} onChange={handleSortChange} >
              <option value="clear">Clear</option>
              <option value="esc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>


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
                        Update
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
                    <td>
                     <button
                  onClick={() => handleAddToCart(item)}
                  className="btn btn-success"
                >
                  Add to Cart
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
