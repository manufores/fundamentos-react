import React from "react";
import UserConsumer from "../context/user";
import { saveUser } from '../utils/storage';
import axios from 'axios';

export default class Register extends React.Component {

  static contextType = UserConsumer;


  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        surname: "",
        tag: ""
      },
      tags: []
    };
    this.onChangeField = this.onChangeField.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.getTags();
  }

  getTags = () => {
    const API_URL = 'http://localhost:3001/';
    const endPoint = `${API_URL}apiv1/tags`;
    axios.get(endPoint)
      .then(res => this.setState({
        tags: res.data.results,
      }))
  }


  onChangeField(event) {
    const { name, value } = event.target;
    this.setState(({ user }) => ({
      user: {
        ...user,
        [name]: value
      }
    }));
  }


  onSubmit(event) {
    event.preventDefault();
    if (this.state.user.name.trim().length <= 3) {
      alert("The name must be bigger than 3 characters");
      return false;
    }
    if (this.state.user.surname.trim().length <= 3) {
      alert("The surname must be bigger than 3 characters");
      return false;
    }
    if (this.state.user.tag.trim().length <= 3) {
      alert("The tag date must be bigger than 3 characters");
      return false;
    }

    saveUser(this.state.user);

    return true;
  }

  render() {
    return (
     
      <div
        className="register-container"
        style={{ width: "50%", margin: "50px auto" }}
      >
        <form
          className="box"
          onSubmit={event => {
            if (this.onSubmit(event)) {
              const { name, surname, tag } = { ...this.state.user };
              const session = { name, surname, tag };
              this.context.session = session;
             
              this.props.history.push("/api");
            }
          }}
        >
          <h1 className="is-large">Formulario de acceso </h1>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                name="name"
                className="input"
                type="text"
                placeholder="Enter Username"
                onChange={this.onChangeField}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Surname</label>
            <div className="control">
              <input
                name="surname"
                className="input"
                type="text"
                placeholder="Enter Surname"
                onChange={this.onChangeField}
              />
            </div>
          </div>

          <div className="field">
            <div className="select">
              <select name="tag" onChange={this.onChangeField}>{console.log(this.state.tags)}
                {this.state.tags.map(tag => (<option key={tag} >{tag}</option>))}
              </select>
            </div>
          </div>
          <div className="field is-grouped"> {console.log(this.state.user)}{console.log(this.context)}
            <div className="control">
              <button className="button is-link" type='submit'>Submit</button>
            </div>
          </div>
        </form>
      </div>
     
    );
  }
}