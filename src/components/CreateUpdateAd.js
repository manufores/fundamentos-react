import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import UserConsumer from '../context/user';
import Global from '../Global';


class CreateUpdateAd extends Component {

    API_URL = Global.url;

    static contextType = UserConsumer;
    // Creo las referencias
    tagsRef = React.createRef();
    nameRef = React.createRef();
    descriptionRef = React.createRef();
    priceRef = React.createRef();
    photoRef = React.createRef();
    typeRef = React.createRef();
    //Inicializo advertId para que luego recoja la id del artículo
    advertId = null;

    state = {
        advert: {},
        status: null,
        tags: []
    };
    // Creo el WillMount para que se rellene el array de tags y se compruebe si tiene id la ruta para que me renderice la parte de editar
    componentWillMount() {
        this.advertId = this.props.match.params.id;
        this.getTags();
        // this.getAdvert();
        if (this.advertId) {
            this.getAdvert();
            console.log(this.state.advert);
        }
    }
    // Función de llamada al backend para traer el anuncio con el id capturado
    getAdvert = () => {
        const id = this.props.match.params.id;

        const endPoint = `${this.API_URL}apiv1/anuncios/${id}`;
        axios.get(endPoint)
            .then(res => this.setState({
                advert: res.data.result
            }));
    }
    // Función  de llamada para setear los tags
    getTags = () => {

        const endPoint = `${this.API_URL}apiv1/tags`;
        axios.get(endPoint)
            .then(res => this.setState({
                tags: res.data.results
            }))
    }

    componentDidMount() {
        //Chequeo sesion del contexto, si no existe redirijo a register
        const session = this.context.session
        console.log('Info de session');
        console.log(session);
        if (!session) {
            return this.props.history.push('/register');
        }
    }
    // Función que actualiza el state con los valores que se han introducido
    changeState = () => {
        this.setState({
            advert: {
                tags: this.tagsRef.current.value,
                name: this.nameRef.current.value,
                description: this.descriptionRef.current.value,
                price: this.priceRef.current.value,
                photo: this.photoRef.current.value,
                type: this.typeRef.current.value
            }
        })
    }
    // Función POST que guarda el anuncio y lo crea (Es para la opción de crear, NO de actualizar)
    saveAdvert = (e) => {
        e.preventDefault();
        // Rellenar State con formulario
        this.changeState();

        axios.post(this.API_URL + 'apiv1/anuncios', this.state.advert)
            .then(res => {
                if (res.data.result) {
                    this.setState({
                        advert: res.data.result,
                        status: 'success'
                    });
                } else {
                    this.setState({
                        status: 'failed'
                    });
                }
            });
    }


    updateAdvert = (e) => {
        e.preventDefault();
        // Rellenar State con formulario
        this.changeState();

        axios.put(this.API_URL + 'apiv1/anuncios/' + this.advertId, this.state.advert)
            .then(res => {
                if (res.data.result) {
                    this.setState({
                        advert: res.data.result,
                        status: 'success'
                    });
                } else {
                    this.setState({
                        status: 'failed'
                    });
                }
            });
    }



    render() {
        // Si se ha realizado el POST ok entonces redirijo a la vista de los anuncios
        if (this.state.status === 'success') {
            return <Redirect to="/api" />;
        }

        var advert = this.state.advert;
        // {console.log(advert)};

        return (
            <div className="register-container"
                style={{ width: "50%", margin: "50px auto" }}>
                <section>
                    {this.advertId &&
                        <React.Fragment>
                            <h1>Editar Artículo</h1>
                            <form className="box" onSubmit={this.updateAdvert}>
                                <div className="field">
                                    <label className="label">Nombre Artículo a editar</label>
                                    <div className="control">
                                        <input type="text" name="title" defaultValue={advert.name} className="input" placeholder="Poner el nombre del artículo" ref={this.nameRef} onChange={this.changeState} />
                                    </div>

                                </div>
                                <div className="field">
                                    <label className="label">Descripción</label>
                                    <div className="control">
                                        <textarea name="content" defaultValue={advert.description} className="input" placeholder="Describe como es el artículo" ref={this.descriptionRef} onChange={this.changeState}></textarea>
                                    </div>

                                </div>

                                <div className="field">
                                    <label className="label">Precio Artículo</label>
                                    <div className="control">
                                        <input type="text" name="title" defaultValue={advert.price} className="input" placeholder="Pon un precio" ref={this.priceRef} onChange={this.changeState} />
                                    </div>

                                    <div className="field">
                                        <label className="label">Foto Artículo</label>
                                        <div className="control">
                                            <input type="text" name="title" defaultValue={advert.photo} className="input" placeholder="Para la foto pon una url" ref={this.photoRef} onChange={this.changeState} />
                                        </div>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">¿Buy or Sell? Artículo</label>
                                    
                                    <div className="select">

                                        <select ref={this.typeRef} value={advert.type} onChange={this.changeState}>
                                            <option value="buy">buy</option>
                                            <option value="sell">sell</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Tag del Artículo</label>
                                        
                                    <div className="select">
                                        <select value={advert.tags} ref={this.tagsRef} onChange={this.changeState}>
                                            {this.state.tags.map(tag => (<option value={tag} key={tag}>{tag}</option>))}
                                        </select>
                                    </div>
                                </div>

                                <input type="submit" value="Actualizar" />
                            </form>
                        </React.Fragment>
                    }
                    {!this.advertId &&
                        <React.Fragment>
                            <h1 className="is-large">Crea artículo</h1>
                            <form className="box" onSubmit={this.saveAdvert}>
                                <div className="field">
                                    <label className="label">Nombre Artículo</label>
                                    <div className="control">
                                        <input type="text" name="title" className="input" placeholder="Poner el nombre del artículo" ref={this.nameRef} onChange={this.changeState} />
                                    </div>

                                </div>
                                <div className="field">
                                    <label className="label">Descripción</label>
                                    <div className="control">
                                        <textarea name="content" className="input" placeholder="Describe como es el artículo" ref={this.descriptionRef} onChange={this.changeState}></textarea>
                                    </div>

                                </div>

                                <div className="field">
                                    <label className="label">Precio Artículo</label>
                                    <div className="control">
                                        <input type="text" name="title" className="input" placeholder="Pon un precio" ref={this.priceRef} onChange={this.changeState} />
                                    </div>

                                    <div className="field">
                                        <label className="label">Foto Artículo</label>
                                        <div className="control">
                                            <input type="text" name="title" className="input" placeholder="Para la foto pon una url" ref={this.photoRef} onChange={this.changeState} />
                                        </div>
                                    </div>
                                </div>


                                <div className="field">
                                    <label className="label">¿Buy or Sell? Artículo</label>
                                    {/* <div className="control">
                                        <input type="text" name="title" className="input" placeholder="Si compras pon Buy y si vendes pon Sell" ref={this.typeRef} onChange={this.changeState} />
                                    </div> */}


                                    <div className="select">

                                        <select ref={this.typeRef} onChange={this.changeState}>
                                            <option value="buy">buy</option>
                                            <option value="sell">sell</option>
                                        </select>
                                    </div>

                                    <div className="field">
                                        <label className="label">Tag del Artículo</label>
                                        <div className="select">
                                            <select ref={this.tagsRef} onChange={this.changeState}>
                                                {this.state.tags.map(tag => (<option key={tag}>{tag}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <input type="submit" value="Guardar" />
                            </form>
                        </React.Fragment>
                    }
                </section>
            </div>
        )
    }
}

export default CreateUpdateAd;