import { useEffect, useState } from "react";
import api from "../services/api";


function Warehouses() {

  const [warehouses, setWarehouses] = useState([]);

  const [editingId, setEditingId] = useState(null);


  const [formData, setFormData] = useState({
    warehouseName:"",
    location:"",
    managerName:"",
    capacity:"",
    status:"Active"
  });



  useEffect(()=>{
    fetchWarehouses();
  },[]);



  async function fetchWarehouses(){

    try{

      const res = await api.get("/warehouses");

      setWarehouses(res.data.data);

    }
    catch(error){

      console.log(error);

    }

  }



  function handleChange(e){

    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });

  }



  async function handleSubmit(e){

    e.preventDefault();


    try{


      if(editingId){

        await api.put(
          `/warehouses/${editingId}`,
          {
            ...formData,
            capacity:Number(formData.capacity)
          }
        );

        alert("Warehouse Updated");


      }
      else{


        await api.post(
          "/warehouses",
          {
            ...formData,
            capacity:Number(formData.capacity)
          }
        );


        alert("Warehouse Added");

      }



      setFormData({
        warehouseName:"",
        location:"",
        managerName:"",
        capacity:"",
        status:"Active"
      });


      setEditingId(null);


      fetchWarehouses();


    }
    catch(error){

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  }





  function editWarehouse(warehouse){


    setEditingId(warehouse._id);


    setFormData({

      warehouseName:warehouse.warehouseName,

      location:warehouse.location,

      managerName:warehouse.managerName,

      capacity:warehouse.capacity,

      status:warehouse.status

    });


  }





  async function deleteWarehouse(id){


    const confirmDelete = window.confirm(
      "Delete this warehouse?"
    );


    if(!confirmDelete) return;



    try{


      await api.delete(
        `/warehouses/${id}`
      );


      alert("Warehouse Deleted");


      fetchWarehouses();


    }
    catch(error){

      console.log(error);

    }


  }





return (

<div>


<h1 className="text-3xl font-bold mb-6">
Warehouses
</h1>




<div className="bg-white shadow rounded-xl p-6 mb-8">


<h2 className="text-xl font-bold mb-4">

{
editingId 
? "Update Warehouse"
: "Add Warehouse"
}

</h2>



<form
onSubmit={handleSubmit}
className="grid grid-cols-1 md:grid-cols-2 gap-4"
>



<input
className="border p-3 rounded"
placeholder="Warehouse Name"
name="warehouseName"
value={formData.warehouseName}
onChange={handleChange}
/>



<input
className="border p-3 rounded"
placeholder="Location"
name="location"
value={formData.location}
onChange={handleChange}
/>



<input
className="border p-3 rounded"
placeholder="Manager Name"
name="managerName"
value={formData.managerName}
onChange={handleChange}
/>



<input
className="border p-3 rounded"
placeholder="Capacity"
type="number"
name="capacity"
value={formData.capacity}
onChange={handleChange}
/>



<select
className="border p-3 rounded"
name="status"
value={formData.status}
onChange={handleChange}
>

<option>
Active
</option>

<option>
Inactive
</option>

</select>



<button
className="bg-blue-600 text-white rounded p-3"
>

{
editingId
? "Update Warehouse"
: "Add Warehouse"
}

</button>



</form>


</div>






<div className="bg-white shadow rounded-xl p-6">


<h2 className="text-xl font-bold mb-4">
Warehouse List
</h2>



<table className="w-full">


<thead>

<tr className="border-b">


<th className="p-3 text-left">
Name
</th>


<th className="p-3 text-left">
Location
</th>


<th className="p-3 text-left">
Manager
</th>


<th className="p-3 text-left">
Capacity
</th>


<th className="p-3 text-left">
Status
</th>


<th className="p-3 text-left">
Action
</th>


</tr>

</thead>




<tbody>


{
warehouses.map((warehouse)=>(


<tr
key={warehouse._id}
className="border-b"
>


<td className="p-3">
{warehouse.warehouseName}
</td>


<td className="p-3">
{warehouse.location}
</td>


<td className="p-3">
{warehouse.managerName}
</td>


<td className="p-3">
{warehouse.capacity}
</td>


<td className="p-3">
{warehouse.status}
</td>



<td className="p-3 space-x-2">


<button
onClick={()=>editWarehouse(warehouse)}
className="bg-yellow-500 text-white px-3 py-1 rounded"
>
Edit
</button>



<button
onClick={()=>deleteWarehouse(warehouse._id)}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Delete
</button>


</td>


</tr>


))
}



</tbody>


</table>


</div>



</div>

);


}


export default Warehouses;