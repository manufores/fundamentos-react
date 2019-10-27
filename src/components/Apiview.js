import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import UserConsumer from "../context/user";
import SearchForm from "./SearchForm";
import Global from '../Global';

class Apiview extends Component {

  API_URL = Global.url;

  static contextType = UserConsumer;

  
  state = {
    articles: [],
    tags: [],
  }

  

  getTags = () => {
    const endPoint = `${this.API_URL}apiv1/tags`;
    axios.get(endPoint)
      .then(res => this.setState({
        tags: res.data.results,
      }))
  }


  getAds = (url) => {
    axios.get(url)
      .then(res => this.setState({
        articles: res.data.results
      }))
  }

  componentDidMount() {
    //Chequeo sesion del contexto, si no existe redirijo a register
    this.getTags();
    const session = this.context.session

    if (!session) {
      return this.props.history.push('/register');
    } else {
      this.listAds(session.tag);
    }
  }

  listAds = (tag) => {
    let baseURL = `${this.API_URL}apiv1/anuncios`;
    if (tag) {
      baseURL = `${baseURL}?tag=${tag}`;
    }
    return this.getAds(baseURL)
  }

  

search = () => {
  let baseURL = `${this.API_URL}apiv1/anuncios`;
  if (this.state.adsSearch.name) {
    baseURL = `${baseURL}?name=${this.state.adsSearch.name}`;
    console.log(baseURL);
  }
  return this.getAds(baseURL);
}  


  render() {
      var listAdverts = this.state.articles.map((adv) => {
      return (
        <div key={adv._id}>
          <div className="column is-one-quarter-desktop is-half-tablet">
            <div className="card"></div>
            <div className="card-image">
              <figure className="image is-4by3">
                <img src={!(adv.photo).includes("http") ? `${this.API_URL}${adv.photo}` : `${adv.photo}`} alt="Placeholder" />
              </figure>
            </div>
            <div className="card-content">
              <div className="content">
                <p className="title is-4">{adv.name}</p>
                {adv.description.substring(0, 150)}
                <div className="movie-info">
                  <div className="tags-container">
                    {adv.tags && adv.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
                <p>Es del tipo: {adv.type}</p>
                <p>Precio ={adv.price}</p>
                <br />
                <Link to={`/detail/${adv._id}`} className="button is-primary is-rounded">read more...</Link>
                <br />
              </div>
            </div>
          </div>
        </div >
      );
    });

    return (
      <div>
        <div>
         <SearchForm />
        </div>
        <div>
          <Link to={'/creaupdate'} className="button is-primary is-rounded">Create new advert</Link>
        </div>
        <div>{listAdverts}</div>
      </div>
    );
  }
}
export default Apiview;