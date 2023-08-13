import React, { useEffect, useState } from 'react'
import './Categories.scss'
import Product from "../../components/products/Products"
import {useNavigate, useParams} from 'react-router'

function Categories() {
  const navigate=useNavigate();
  const params=useParams();
  const[categoryId,setCategoryId]=useState('');
  const categoryList=[{
     id:'comics',
     value:'Comics'
  },{
    id:'tv-shows',
    value:'TV Shows'
 },{
  id:'sports',
  value:'Sports',
},
];
useEffect(()=>{
  setCategoryId(params.categoryId);
  //api call
},[params])
function updateCategory(e){
       navigate('/category/${e.target.value}'); 
}

  
  return (
    <div className="Categories">  
     <div className="container">
    <div className="header">
      <div className="info">
        <h2>Explore all print and Artwork</h2>
        <p>India's lsrgest collection of wall posters for your bedroom, living room, kitchen and posters & all prints at highst quality lowest price guranted </p>
        </div>
        <div className="sort-by">
          <div className="sort-by-container">
            <p className="sort-by-text">Sort By
            </p>
            <select name="sort-by" id="sort-by">
              <option value="relevance">Rrelevance</option>
              <option value="newest-first">Newest First</option>
              <option value="price lth">Price - Low to High</option>
            </select>
          </div>
        </div>
        </div> 
        <div className="content">
          <div className="filter-box">
            <div className="category-filter">
              <h3>Category</h3>
              {categoryList.map((item)=> (
               <div key={item.id} className="filter-radio">
                <input 
                   name="category"
                   type="radio"
                   value={item.id}
                   id={item.id}
                   onChange={updateCategory}
                   checked={item.id=== categoryId}
                />
                <label htmlFor={item.id}>{item.value} </label>
               </div>
              ))}
               
            </div>
          </div>
          <div className="products-box">
             <Product />
             <Product />
             <Product />
             <Product />
             <Product />
             <Product />
          </div>
        </div>
    </div>
    </div>
  )
}

export default Categories