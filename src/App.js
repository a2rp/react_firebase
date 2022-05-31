import { useState, useEffect } from 'react';
import './App.css';
import { db } from "./firebase-config"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"

function App() {
  const [newName, setNewName] = useState("")
  const [newAge, setNewAge] = useState(0)

  const [users, setUsers] = useState([])
  const usersCollectionRef = collection(db,"users")

  const createUser = async () => {
    if (!newName.trim()) {
      alert ("name is empty");
      document.getElementById("name").focus();
      return;
    }
    if (document.getElementById("age").value.length==0) {
      alert ("age is empty");
      document.getElementById("age").focus();
      return;
    }
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    await addDoc(usersCollectionRef, {name: newName, age: Number(newAge)});
    window.location.reload(false);
  };

  const updateUser = async (id,age) => {
    let update_buttons = document.getElementsByClassName("update");
    Array.from(update_buttons).forEach((el) => {
      el.disabled = true
    });
    let delete_buttons = document.getElementsByClassName("delete");
    Array.from(delete_buttons).forEach((el) => {
      el.disabled = true
    });
    const userDoc = doc(db,"users",id)
    const newFields = {age: age + 1}
    await updateDoc(userDoc, newFields)
    setUsers({users});
    window.location.reload(false);
  };

  const deleteUser = async (id) => {
    // document.getElementsByClassName("delete").forEach(input => input.disabled = true);
    let update_buttons = document.getElementsByClassName("update");
    Array.from(update_buttons).forEach((el) => {
      el.disabled = true
    });
    let delete_buttons = document.getElementsByClassName("delete");
    Array.from(delete_buttons).forEach((el) => {
      el.disabled = true
    });
    const userDoc = doc(db,"users",id)
    await deleteDoc(userDoc)
    window.location.reload(false);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      // console.log(data);
      setUsers(data.docs.map((doc)=>({...doc.data(),id: doc.id})))
    }
    getUsers()
  }, [])

  return (
    <div className="App">
      <div style={{"width": "200px", "text-align": "left", "background-color": "#eee", "padding": "15px"}}>
        <input type="text" id="name" placeholder="name" onChange={(event)=>{setNewName(event.target.value)}} /><br /><br />
        <input type="number" id="age" placeholder="age" onChange={(event)=>{setNewAge(event.target.value)}} /><br /><br />
        <button onClick={createUser}>Create User</button>
      </div>
      <div className="users" style={{"text-align": "left", "height": "300px", "overflow": "scroll", "margin-top": "15px"}}>
        {users.map((user)=>{
          return (
            <div style={{"margin-bottom": "5px", "background-color": "#eee", "padding": "15px"}}>
              <div>Name: {user.name}</div><div>Age: {user.age}</div>
              <div style={{"margin-top": "5px"}}>
                <button className="update"onClick={()=>{updateUser(user.id,user.age)}} 
                onPress={() => {
                  // Save Document
                  this.saveAnnotations();
                  this.forceUpdate();
                }} 
                style={{"margin-right": "15px"}}>Increase Age</button>
                <button className="delete" onClick={()=>{deleteUser(user.id)}}>Delete User</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
