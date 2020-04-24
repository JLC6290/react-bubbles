import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [colorToAdd, setColorToAdd] = useState({
    color: "",
    code: { hex: "" }
  });

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = event => {
    event.preventDefault();
    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(response => {
        console.log(response.data);
        const updatedColors = [...colors.filter(color => color.id !== response.data.id), response.data]
        updateColors(updatedColors);
      })
      .catch(error => {
        console.log("error caught, colorToEdit: ", colorToEdit);
        console.log("put request error: ", error)
      })
  };

  const deleteColor = color => {
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`, color)
      .then(response => {
        console.log("delete request response: ", response);
        const updatedColors = [...colors.filter(remaining => remaining.id !== color.id)]
        updateColors(updatedColors);
      })
      .catch(error => {
        console.log("delete request error: ", error);
      });
  };

  const addColor = event => {
    event.preventDefault();
    const color = colorToAdd;
    console.log(color);
    axiosWithAuth()
      .post("http://localhost:5000/api/colors", color)
      .then(response => {
        console.log("addColor post response: ", response);
        // axiosWithAuth().get("http://localhost:5000/api/colors").then(response => {updateColors(response.data)})
        updateColors(response.data)
      })
      .catch(error => {
        console.log("addColor post request error: ", error);
      })
  }

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
      <form onSubmit={addColor}>
          <legend>Add a color</legend>
          <label>color name: 
            <input
              type="text"
              name="color"
              placeholder="color name"
              value={colorToAdd.color}
              onChange={event => setColorToAdd({...colorToAdd, color: event.target.value})}
            />  
            <input
              type="text"
              name="hex"
              placeholder="hex code"
              value={colorToAdd.code.hex}
              onChange={event => setColorToAdd({...colorToAdd, code: {hex: event.target.value}})}
            />  
          </label>
          <div className="button-row">
            <button type="submit">Add</button>
          </div>
      </form>
    </div>
  );
};

export default ColorList;
