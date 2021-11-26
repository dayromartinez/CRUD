import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from "react";

const HOST_API = "http://localhost:8080/api";

const initialState = {
  list: [],
  item: {}
}

const Store = createContext(initialState);

const Form = () => {

  const formRef = useRef(null);
  const { dispatch, state: {item}} = useContext(Store);
  const [state, setState] = useState({item});

  const onAdd = (event) => {

    event.preventDefault();

    const request = {
      nombre: state.nombre,
      id: null,
      isCompleted: false
    };

    fetch(HOST_API+"/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((todo) => {
      dispatch({type: "add-item", item: todo});
      setState({nombre: "", isCompleted: false});
      formRef.current.reset();
    });
  }

  const onEdit = (event) => {

    event.preventDefault();

    const request = {
      nombre: state.nombre,
      id: item.id,
      isCompleted: item.isCompleted
    };

    fetch(HOST_API+"/todo/"+item.id, {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((todo) => {
      dispatch({type: "edit-item", item: todo});
      setState({nombre: ""});
      formRef.current.reset();
    });
  }
  console.log(item.nombre);
  return (
    <form ref={formRef}> 
      <input type="text" name="name" defaultValue={item.nombre} onChange={(event) => {
        setState({...state, nombre: event.target.value})
      }}/>
      {item.id === undefined ? (<button onClick={onAdd}>Agregar</button>) : (<button onClick={onEdit}>Editar</button>)}
    </form>
  );
}

const List = () => {

  const { dispatch, state } = useContext(Store);

  useEffect(() => {
    fetch(HOST_API+"/todos")
    .then(response => response.json())
    .then((list) => {
      dispatch({type: "update-list", list})
    })
  },[state.list.length, dispatch])


  const onDelete = (id) => {
    fetch(HOST_API+"/todo/"+id, {
      method: "DELETE"
    })
    .then((list) => {
      dispatch({type: "delete-item", id})
    })
  };

  const onEdit = (todo) => {
    dispatch({type: "edit-item", item: todo})
  };

  return(
    <div>
      <table>

        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>¿Está completado?</td>
          </tr>
        </thead>

        <tbody>
          {state.list.map((todo) => {
            return (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.nombre}</td>
                <td>{todo.isCompleted === true ? "Sí" : "No"}</td>
                <td><button onClick={() => onDelete(todo.id)}>Eliminar</button></td>
                <td><button onClick={() => onEdit(todo)}>Editar</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


function reducer(state, action) {
  switch (action.type) {
    case 'update-item':
      const listUpdateEdit = state.list.map((todo) => {
        if(todo.id === action.item.id){
          return action.item; 
        }
        return todo;
      })
      return {...state, list: listUpdateEdit, item: {}}
    case 'delete-item':
      const listUpdate = state.list.filter((todo) => {
        return todo.id !== action.id;
      })
      return {...state, list: listUpdate}
    case 'update-list':
      return {...state, list: action.list}
    case 'edit-item':
      return {...state, item: action.item}
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return {...state, list: newList}
    default:
      return state;
  }
}


const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (<Store.Provider value={{state, dispatch}}>
    {children}
  </Store.Provider>);
}


function App() {
  return (
    <StoreProvider>
      <Form />
      <List />
    </StoreProvider>
  );
}

export default App;
