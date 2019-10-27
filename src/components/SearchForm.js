import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import UserConsumer from "../context/user";
import Global from '../Global';

class SearchForm extends Component {

    API_URL = Global.url;

    static contextType = UserConsumer;

    nameRef = React.createRef();
    priceRef = React.createRef();
    typeRef = React.createRef();
    tagsRef = React.createRef();

    query = ["name=", "price=", "venta=", "tag=", "&"];
    chainsearch = "";
    types = ["Todo", "Vender", "Comprar"];

    state = {
        search: "",
        redirect: false,
        tags: [],
        newTags: ""
    };

    componentDidMount() {
        this.getTags();
    }

    getTags = () => {
        // const API_URL = 'http://localhost:3001/';
        const endPoint = `${this.API_URL}apiv1/tags`;
        axios.get(endPoint)
            .then(res => this.setState({
                tags: res.data.results,
                newTags: res.data.results.unshift('Todos')
            }))
    };

    redirectToSearch = (e) => {
        e.preventDefault();
        var urlsearch = this.handlerQuery();
        if (this.chainsearch.trim().length <= 1) {
            alert("Tiene que rellenar algún campo de busqueda");
            return false;
        }
        this.setState({
            search: urlsearch,
            redirect: true
        });

    };

    handlerQuery = () => {
        if (this.nameRef.current.value !== "") {
            this.chainsearch = this.chainsearch.concat(this.query[0], this.nameRef.current.value);
        }
        if (this.priceRef.current.value !== "") {
            if (this.chainsearch.length > 0) {
                this.chainsearch = this.chainsearch.concat(this.query[4], this.query[1], this.priceRef.current.value);
            } else {
                this.chainsearch = this.chainsearch.concat(this.query[1], this.priceRef.current.value);
            }
        }
        if (this.typeRef.current.value !== "Todo") {
            if (this.chainsearch.length > 0) {
                this.chainsearch = this.chainsearch.concat(this.query[4], this.query[2], this.buyOrSell());
            } else {
                this.chainsearch = this.chainsearch.concat(this.query[2], this.buyOrSell());
            }
        }

        if (this.tagsRef.current.value !== "Todos") {
            if (this.chainsearch.length > 0) {
                this.chainsearch = this.chainsearch.concat(this.query[4], this.query[3], this.tagsRef.current.value);
            } else {
                this.chainsearch = this.chainsearch.concat(this.query[3], this.tagsRef.current.value);
            }
        }

        return this.chainsearch;
    }

    buyOrSell = () => {
        if (this.typeRef.current.value === "Vender") {
            return true;
        } else if (this.typeRef.current.value === "Comprar") {
            return false;
        } else {
            return null;
        }
    }



    render() {


        if (this.state.redirect) {
            return (
                <Redirect to={'/redirect/' + this.state.search} />
            );
        }

        return (
            <div>
                <h1>Buscador</h1>
                <form className="box" onSubmit={this.redirectToSearch}>
                    <div className="field">
                        <label className="label">Nombre Artículo</label>
                        <div className="control">
                            <input type="text" className="input" placeholder="Poner el nombre del artículo" ref={this.nameRef} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Precio</label>
                        <div className="control">
                            <input type="text" className="input" placeholder="Buscas por el precio del artículo" ref={this.priceRef} />
                        </div>
                    </div>
                    <div className="control">
                        <label className="label">Vender o Comprar</label>
                        <div className="select">
                            <select ref={this.typeRef} onChange={this.buyOrSell}>
                                {this.types.map(type => (<option key={type}>{type}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="control">
                        <label className="label">Búsqueda por tag</label>
                        <div className="select" >
                            <select ref={this.tagsRef} >
                                {this.state.tags.map(tag => (<option key={tag}>{tag}</option>))}
                            </select>
                        </div>
                    </div>
                    <input type="submit" value="Buscar" />
                </form>
            </div>

        )
    }
}

export default SearchForm;