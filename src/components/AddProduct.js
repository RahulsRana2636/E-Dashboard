import React from 'react';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifydata = {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }
  const successNotify = () => toast.success("Product Added Successfully!", notifydata);
  const errNotify = () => toast.error("Product not Added!", notifydata);
const AddProduct = () => {
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [company, setCompnay] = React.useState('');
    const [error,setError] = React.useState(false);
    const navigate = useNavigate();
    const addProduct = async () => {
        if(!name || !price || !company || !category)
        {   errNotify();
            setError(true);
            return false
        }

        const userId = JSON.parse(localStorage.getItem('user'))._id;
        let result = await fetch(process.env.REACT_APP_API_URL +'add-product', {
            method: "post",
        body: JSON.stringify({ name, price, category, company, userId }),
        headers: {
          "Content-type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    result = await result.json();
             successNotify();
             setTimeout(() => {
                navigate('/');
            }, 1200);
    }
       
    return (
        <div className='product'>
        <h1>Add Product</h1>
        <input type="text" placeholder='Enter product name' className='inputBox'
            value={name} onChange={(e) => { setName(e.target.value) }}
        />
        {error && !name && <span className='invalid-input'>Enter valid name</span>}

        <input type="text" placeholder='Enter product price' className='inputBox'
            value={price} onChange={(e) => { setPrice(e.target.value) }}
        />
        {error && !price && <span className='invalid-input'>Enter valid price</span>}

        <input type="text" placeholder='Enter product category' className='inputBox'
            value={category} onChange={(e) => { setCategory(e.target.value) }}
        />
        {error && !category && <span className='invalid-input'>Enter valid category</span>} 

        <input type="text" placeholder='Enter product company' className='inputBox'
            value={company} onChange={(e) => { setCompnay(e.target.value) }}
        />
        {error && !company && <span className='invalid-input'>Enter valid company</span>}


        <button onClick={addProduct} className='appButton'>Add Products</button>
        <ToastContainer />
    </div>
    )
}

export default AddProduct;